import { jest } from '@jest/globals';
import request from 'supertest';
import { createTestApp, cleanup } from './setup.js';

// Mock dependencies
jest.mock('../../src/services/fileService.js', () => ({
    fileService: {
        saveFile: jest.fn(),
        deleteFile: jest.fn()
    }
}));

// Import after mocking
import { fileService } from '../../src/services/fileService.js';

describe('File Routes', () => {
    let app;
    let mockFile;

    beforeAll(async () => {
        app = createTestApp();
    });

    afterAll(async () => {
        await cleanup();
    });

    beforeEach(() => {
        mockFile = {
            fieldname: 'files',
            originalname: 'test.pdf',
            encoding: '7bit',
            mimetype: 'application/pdf',
            buffer: Buffer.from('test content'),
            size: 1024
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/files/upload', () => {
        it('should upload files successfully', async () => {
            // Arrange
            const savedFile = { id: '123', name: 'test.pdf' };
            fileService.saveFile.mockImplementation(() => Promise.resolve(savedFile));

            // Act
            const response = await request(app)
                .post('/api/files/upload')
                .attach('files', mockFile.buffer, {
                    filename: mockFile.originalname,
                    contentType: mockFile.mimetype
                });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ files: [savedFile] });
            expect(fileService.saveFile).toHaveBeenCalled();
        });

        it('should handle multiple file uploads', async () => {
            // Arrange
            const savedFiles = [
                { id: '123', name: 'test1.pdf' },
                { id: '456', name: 'test2.pdf' }
            ];
            let callCount = 0;
            fileService.saveFile.mockImplementation(() => {
                return Promise.resolve(savedFiles[callCount++]);
            });

            // Act
            const response = await request(app)
                .post('/api/files/upload')
                .attach('files', mockFile.buffer, {
                    filename: 'test1.pdf',
                    contentType: mockFile.mimetype
                })
                .attach('files', mockFile.buffer, {
                    filename: 'test2.pdf',
                    contentType: mockFile.mimetype
                });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ files: savedFiles });
            expect(fileService.saveFile).toHaveBeenCalledTimes(2);
        });

        it('should handle file upload errors', async () => {
            // Arrange
            fileService.saveFile.mockImplementation(() => Promise.reject(new Error('Upload failed')));

            // Act
            const response = await request(app)
                .post('/api/files/upload')
                .attach('files', mockFile.buffer, {
                    filename: mockFile.originalname,
                    contentType: mockFile.mimetype
                });

            // Assert
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Internal server error');
        });
    });

    describe('DELETE /api/files/:id', () => {
        it('should delete file successfully', async () => {
            // Arrange
            fileService.deleteFile.mockImplementation(() => Promise.resolve(true));

            // Act
            const response = await request(app)
                .delete('/api/files/123');

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true });
            expect(fileService.deleteFile).toHaveBeenCalledWith('123');
        });

        it('should handle file not found error', async () => {
            // Arrange
            fileService.deleteFile.mockImplementation(() => Promise.reject(new Error('File not found')));

            // Act
            const response = await request(app)
                .delete('/api/files/123');

            // Assert
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'File not found' });
        });

        it('should handle deletion errors', async () => {
            // Arrange
            fileService.deleteFile.mockImplementation(() => Promise.reject(new Error('Deletion failed')));

            // Act
            const response = await request(app)
                .delete('/api/files/123');

            // Assert
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Internal server error');
        });
    });
}); 