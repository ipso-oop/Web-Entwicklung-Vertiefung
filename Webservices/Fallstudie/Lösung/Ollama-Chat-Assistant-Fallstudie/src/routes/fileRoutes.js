import express from 'express';
import multer from 'multer';
import { fileService } from '../services/fileService.js';
import { config } from '../config/config.js';

const router = express.Router();

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept PDF and text files
        if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and text files are allowed.'));
        }
    }
});

router.post('/upload', upload.array('files'), async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        console.log('Processing file upload:', req.files.map(f => f.originalname));
        const files = await Promise.all(req.files.map(file => fileService.saveFile(file)));
        console.log('Files processed successfully:', files.map(f => f.name));
        res.json({ files });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ 
            error: 'Failed to upload files',
            details: error.message
        });
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await fileService.deleteFile(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error('File deletion error:', error);
        if (error.message === 'File not found') {
            res.status(404).json({ error: 'File not found' });
        } else {
            res.status(500).json({ 
                error: 'Failed to delete file',
                details: error.message
            });
        }
    }
});

export default router; 