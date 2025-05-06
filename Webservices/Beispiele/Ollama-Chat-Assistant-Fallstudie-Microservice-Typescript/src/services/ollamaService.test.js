import { jest } from '@jest/globals';
import { ollamaService } from './ollamaService.js';

// Mock fetch
jest.mock('node-fetch', () => {
    const mockFetch = jest.fn();
    return mockFetch;
});

import fetch from 'node-fetch';
import { config } from '../config/config.js';

// Mock dependencies
jest.unstable_mockModule('../config/config.js', () => ({
    config: {
        modelName: 'test-model',
        ollamaUrls: {
            local: 'http://localhost:11434',
            external: 'http://external-ollama:11434'
        }
    }
}));

describe('OllamaService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('generateResponse', () => {
        it('should generate response with context successfully', async () => {
            // Arrange
            const prompt = 'What is the main idea?';
            const context = 'This is the context';
            const expectedResponse = 'This is a test response';
            const mockResponse = {
                ok: true,
                json: () => Promise.resolve({ response: expectedResponse })
            };
            fetch.mockImplementation(() => Promise.resolve(mockResponse));

            // Act
            const response = await ollamaService.generateResponse(prompt, context, 'local');

            // Assert
            expect(response).toBe(expectedResponse);
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/generate'),
                expect.objectContaining({
                    method: 'POST',
                    body: expect.stringContaining(prompt)
                })
            );
        });

        it('should generate response without context successfully', async () => {
            // Arrange
            const prompt = 'What is the main idea?';
            const expectedResponse = 'This is a test response';
            const mockResponse = {
                ok: true,
                json: () => Promise.resolve({ response: expectedResponse })
            };
            fetch.mockImplementation(() => Promise.resolve(mockResponse));

            // Act
            const response = await ollamaService.generateResponse(prompt);

            // Assert
            expect(response).toBe(expectedResponse);
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/generate'),
                expect.objectContaining({
                    method: 'POST',
                    body: expect.stringContaining(prompt)
                })
            );
        });

        it('should use external Ollama URL when specified', async () => {
            // Arrange
            const prompt = 'What is the main idea?';
            const mockResponse = {
                ok: true,
                json: () => Promise.resolve({ response: 'test response' })
            };
            fetch.mockImplementation(() => Promise.resolve(mockResponse));

            // Act
            await ollamaService.generateResponse(prompt, null, 'external');

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('http://external-ollama:11434'),
                expect.any(Object)
            );
        });

        it('should handle API errors gracefully', async () => {
            // Arrange
            const prompt = 'What is the main idea?';
            const mockResponse = {
                ok: false,
                status: 500
            };
            fetch.mockImplementation(() => Promise.resolve(mockResponse));

            // Act & Assert
            await expect(ollamaService.generateResponse(prompt))
                .rejects
                .toThrow('Failed to generate response');
        });

        it('should handle network errors gracefully', async () => {
            // Arrange
            const prompt = 'What is the main idea?';
            fetch.mockImplementation(() => Promise.reject(new Error('Network error')));

            // Act & Assert
            await expect(ollamaService.generateResponse(prompt))
                .rejects
                .toThrow('Network error');
        });
    });
}); 