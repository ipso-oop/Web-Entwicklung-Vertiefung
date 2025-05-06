import { jest } from '@jest/globals';
import { fileService } from './fileService.js';
import { parsePDF } from '../utils/pdfParser.js';
import fs from 'fs';

// Mock dependencies
jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn(),
        writeFile: jest.fn(),
        unlink: jest.fn()
    }
}));

jest.mock('../utils/pdfParser.js', () => ({
    parsePDF: jest.fn()
}));

describe('FileService', () => {
    let mockFile;
    let mockContent;

    beforeEach(() => {
        // Reset the service instance
        fileService.uploadedFiles.clear();

        // Setup mock file
        mockFile = {
            path: '/tmp/test.pdf',
            originalname: 'test.pdf',
            mimetype: 'application/pdf'
        };

        mockContent = 'Test file content';
        fs.promises.readFile.mockImplementation(() => Promise.resolve(Buffer.from(mockContent)));
        parsePDF.mockImplementation(() => Promise.resolve(mockContent));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('saveFile', () => {
        it('should save a PDF file successfully', async () => {
            // Act
            const result = await fileService.saveFile(mockFile);

            // Assert
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('name', mockFile.originalname);
            expect(fileService.uploadedFiles.size).toBe(1);
            expect(fs.promises.readFile).toHaveBeenCalledWith(mockFile.path);
            expect(parsePDF).toHaveBeenCalled();
        });

        it('should save a text file successfully', async () => {
            // Arrange
            const textFile = { ...mockFile, mimetype: 'text/plain' };

            // Act
            const result = await fileService.saveFile(textFile);

            // Assert
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('name', textFile.originalname);
            expect(fileService.uploadedFiles.size).toBe(1);
            expect(fs.promises.readFile).toHaveBeenCalledWith(textFile.path);
            expect(parsePDF).not.toHaveBeenCalled();
        });

        it('should handle PDF parsing errors', async () => {
            // Arrange
            parsePDF.mockImplementation(() => Promise.reject(new Error('PDF parsing failed')));

            // Act & Assert
            await expect(fileService.saveFile(mockFile)).rejects.toThrow('PDF parsing failed');
        });
    });

    describe('deleteFile', () => {
        it('should delete a file successfully', async () => {
            // Arrange
            const savedFile = await fileService.saveFile(mockFile);
            fs.promises.unlink.mockResolvedValue();

            // Act
            await fileService.deleteFile(savedFile.id);

            // Assert
            expect(fileService.uploadedFiles.size).toBe(0);
            expect(fs.promises.unlink).toHaveBeenCalledWith(mockFile.path);
        });

        it('should throw error when file not found', async () => {
            // Act & Assert
            await expect(fileService.deleteFile('non-existent-id')).rejects.toThrow('File not found');
            expect(fs.promises.unlink).not.toHaveBeenCalled();
        });
    });

    describe('getFile', () => {
        it('should return file when it exists', async () => {
            // Arrange
            const savedFile = await fileService.saveFile(mockFile);

            // Act
            const file = fileService.getFile(savedFile.id);

            // Assert
            expect(file).toBeDefined();
            expect(file.id).toBe(savedFile.id);
            expect(file.name).toBe(mockFile.originalname);
        });

        it('should return undefined when file does not exist', async () => {
            // Arrange
            const fileId = '123';
            fs.promises.readFile.mockImplementation(() => Promise.reject(new Error('File not found')));

            // Act
            const result = await fileService.getFile(fileId);

            // Assert
            expect(result).toBeUndefined();
        });
    });

    describe('getAllFiles', () => {
        it('should return all saved files', async () => {
            // Act
            const files = await fileService.getAllFiles();

            // Assert
            expect(Array.isArray(files)).toBe(true);
            expect(files.length).toBeGreaterThan(0);
            expect(files[0]).toHaveProperty('id');
            expect(files[0]).toHaveProperty('name');
        });
    });
}); 