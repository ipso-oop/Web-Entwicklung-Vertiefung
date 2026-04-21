import express from 'express';
import { ollamaService } from '../services/ollamaService.js';
import { fileService } from '../services/fileService.js';

const router = express.Router();

router.post('/:type', async (req, res, next) => {
    try {
        const { prompt, fileIds = [] } = req.body;
        const type = req.params.type;

        // Gather context from uploaded files
        let context = '';
        for (const fileId of fileIds) {
            const file = fileService.getFile(fileId);
            if (file) {
                context += `Content from ${file.name}:\n${file.content}\n\n`;
            }
        }

        const response = await ollamaService.generateResponse(prompt, context, type);
        res.json({ response });
    } catch (error) {
        next(error);
    }
});

export default router; 