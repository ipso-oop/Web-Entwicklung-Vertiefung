import express from 'express';
import cors from 'cors';
import { config } from './src/config/config.js';
import fileRoutes from './src/routes/fileRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';
import chatHistoryRoutes from './src/routes/chatHistoryRoutes.js';
import { errorHandler } from './src/middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(config.paths.public));

// Routes
app.use('/api/files', fileRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/history', chatHistoryRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});