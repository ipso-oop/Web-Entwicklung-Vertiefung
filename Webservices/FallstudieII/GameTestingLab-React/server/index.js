import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import ratingsRoutes from './routes/ratings.js';

// Initialize express
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/ratings', ratingsRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('API Running');
});

// Use PORT from environment variables
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));