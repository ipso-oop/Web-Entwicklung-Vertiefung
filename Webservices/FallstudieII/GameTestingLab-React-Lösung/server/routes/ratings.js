import express from 'express';
import Rating from '../models/Rating.js';
import { protect as auth } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/ratings:
 *   post:
 *     summary: Create a rating
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - game
 *               - rating
 *             properties:
 *               game:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rating updated
 *       201:
 *         description: Rating created
 */
router.post('/', auth, async (req, res) => {
  try {
    const { game, rating, comment } = req.body;

    // Check if user already rated this game
    let existingRating = await Rating.findOne({
      user: req.user.id,
      game
    });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.comment = comment;
      await existingRating.save();
      return res.json(existingRating);
    }

    // Create new rating
    const newRating = new Rating({
      user: req.user.id,
      game,
      rating,
      comment
    });

    const savedRating = await newRating.save();
    res.status(201).json(savedRating);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Server error' 
    });
  }
});

/**
 * @swagger
 * /api/ratings/game/{gameId}:
 *   get:
 *     summary: Get all ratings for a game
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of ratings with pagination
 */
router.get('/game/:gameId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const ratings = await Rating.find({ game: req.params.gameId })
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Rating.countDocuments({ game: req.params.gameId });

    res.json({
      data: ratings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Server error' 
    });
  }
});

/**
 * @swagger
 * /api/ratings/user:
 *   get:
 *     summary: Get all ratings by current user
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of user ratings with pagination
 */
router.get('/user', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const ratings = await Rating.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Rating.countDocuments({ user: req.user.id });

    res.json({
      data: ratings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Server error' 
    });
  }
});

/**
 * @swagger
 * /api/ratings/{id}:
 *   delete:
 *     summary: Delete a rating
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Rating deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Rating not found
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Rating not found' 
      });
    }

    // Check user
    if (rating.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'User not authorized' 
      });
    }

    await rating.deleteOne();
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Server error' 
    });
  }
});

export default router;
