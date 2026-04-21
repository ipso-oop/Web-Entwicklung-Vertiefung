import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from '../../src/config/config.js';
import fileRoutes from '../../src/routes/fileRoutes.js';
import chatRoutes from '../../src/routes/chatRoutes.js';
import { errorHandler } from '../../src/middleware/errorHandler.js';

// Get the upload directory path
const uploadDir = join(dirname(fileURLToPath(import.meta.url)), '../../uploads');

export function createTestApp() {
    const app = express();
    
    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.static(config.paths.public));

    // Configure multer for test environment
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

    // Routes
    app.use('/api/files', fileRoutes);
    app.use('/api/chat', chatRoutes);

    // Error handling
    app.use(errorHandler);

    return app;
}

// Clean up function to be called after tests
export async function cleanup() {
    // No need to clean up files in test environment
    // as we're using memory storage
} 