import { jest } from '@jest/globals';
import request from 'supertest';
import { createTestApp, cleanup } from './setup.js';

// Mock dependencies
jest.mock('../../src/services/ollamaService.js', () => ({
    ollamaService: {
        generateResponse: jest.fn()
    }
}));

jest.mock('../../src/services/fileService.js', () => ({
    fileService: {
        getFile: jest.fn()
    }
}));

// Import after mocking
import { ollamaService } from '../../src/services/ollamaService.js';
import { fileService } from '../../src/services/fileService.js';

describe('Chat Routes', () => {
    let app;

    beforeAll(async () => {
        app = createTestApp();
    });

    afterAll(async () => {
        await cleanup();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/chat/:type', () => {
        it('should generate response with file context successfully', async () => {
            // Arrange
            const prompt = 'What is the main idea?';
            const fileIds = ['123', '456'];
            const mockFiles = [
                { id: '123', name: 'test1.pdf', content: 'Content from file 1' },
                { id: '456', name: 'test2.pdf', content: 'Content from file 2' }
            ];
            const expectedResponse = 'This is a test response';

            fileService.getFile
                .mockImplementationOnce(() => Promise.resolve(mockFiles[0]))
                .mockImplementationOnce(() => Promise.resolve(mockFiles[1]));
            ollamaService.generateResponse.mockImplementation(() => Promise.resolve(expectedResponse));

            // Act
            const response = await request(app)
                .post('/api/chat/local')
                .send({ prompt, fileIds });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ response: expectedResponse });
            expect(fileService.getFile).toHaveBeenCalledTimes(2);
            expect(ollamaService.generateResponse).toHaveBeenCalledWith(
                prompt,
                expect.stringContaining('Content from file 1'),
                'local'
            );
        });

        it('should generate response without file context', async () => {
            // Arrange
            const prompt = 'What is the main idea?';
            const expectedResponse = 'This is a test response';
            ollamaService.generateResponse.mockImplementation(() => Promise.resolve(expectedResponse));

            // Act
            const response = await request(app)
                .post('/api/chat/local')
                .send({ prompt });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ response: expectedResponse });
            expect(fileService.getFile).not.toHaveBeenCalled();
            expect(ollamaService.generateResponse).toHaveBeenCalledWith(
                prompt,
                '',
                'local'
            );
        });

        it('should handle non-existent files gracefully', async () => {
            // Arrange
            const prompt = 'What is the main idea?';
            const fileIds = ['123'];
            fileService.getFile.mockImplementation(() => Promise.resolve(undefined));
            ollamaService.generateResponse.mockImplementation(() => Promise.resolve('Test response'));

            // Act
            const response = await request(app)
                .post('/api/chat/local')
                .send({ prompt, fileIds });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ response: 'Test response' });
            expect(fileService.getFile).toHaveBeenCalledWith('123');
        });

        it('should handle Ollama service errors', async () => {
            // Arrange
            const prompt = 'What is the main idea?';
            ollamaService.generateResponse.mockImplementation(() => Promise.reject(new Error('Ollama service error')));

            // Act
            const response = await request(app)
                .post('/api/chat/local')
                .send({ prompt });

            // Assert
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Internal server error');
        });

        it('should use external Ollama when specified', async () => {
            // Arrange
            const prompt = 'What is the main idea?';
            const expectedResponse = 'This is a test response';
            ollamaService.generateResponse.mockImplementation(() => Promise.resolve(expectedResponse));

            // Act
            const response = await request(app)
                .post('/api/chat/external')
                .send({ prompt });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ response: expectedResponse });
            expect(ollamaService.generateResponse).toHaveBeenCalledWith(
                prompt,
                '',
                'external'
            );
        });
    });
}); 