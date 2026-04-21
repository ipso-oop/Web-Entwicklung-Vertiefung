import express from 'express';
import User from '../models/User.js';
import { generateToken, protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Bad request
 */
router.post('/', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'User already exists' 
      });
    }
    
    // Create new user
    user = new User({
      username,
      email,
      password,
    });
    
    await user.save();
    
    // Generate JWT
    const token = generateToken(user._id);
    
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        progress: user.progress,
      },
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
 * /api/users/me:
 *   get:
 *     summary: Get current user data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/me', protect, async (req, res) => {
  try {
    // Get user without password
    const user = await User.findById(req.user._id)
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'User not found' 
      });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Server error' 
    });
  }
});

export default router;

