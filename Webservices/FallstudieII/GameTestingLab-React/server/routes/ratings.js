import express from 'express';
import Rating from '../models/Rating.js';
import { protect as auth } from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/ratings
// @desc    Create a rating
// @access  Private
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
    res.json(savedRating);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/ratings/game/:gameId
// @desc    Get all ratings for a game
// @access  Public
router.get('/game/:gameId', async (req, res) => {
  try {
    const ratings = await Rating.find({ game: req.params.gameId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/ratings/user
// @desc    Get all ratings by current user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const ratings = await Rating.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/ratings/:id
// @desc    Delete a rating
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({ msg: 'Rating not found' });
    }

    // Check user
    if (rating.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await rating.deleteOne();
    res.json({ msg: 'Rating removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router; 