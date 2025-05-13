import express from 'express';
import { chatHistoryService } from '../services/chatHistoryService.js';

const router = express.Router();

// Save a message to history
router.post('/save', async (req, res, next) => {
    try {
        const { role, content } = req.body;
        await chatHistoryService.addMessage(role, content);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

// Get chat history
router.get('/load', async (req, res, next) => {
    try {
        const history = chatHistoryService.getHistory();
        res.json({ history });
    } catch (error) {
        next(error);
    }
});

// Clear chat history
router.post('/clear', async (req, res, next) => {
    try {
        await chatHistoryService.clearHistory();
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

export default router; 