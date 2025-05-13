import { promisify } from 'util';
import fs from 'fs';
import { parsePDF } from '../utils/pdfParser.js';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

class FileService {
    constructor() {
        this.uploadedFiles = new Map();
    }

    async extractTextFromFile(file) {
        try {
            let content;
            
            if (file.buffer) {
                // Handle memory storage
                content = file.buffer;
            } else {
                // Handle disk storage
                content = await readFile(file.path);
            }
            
            if (file.mimetype === 'application/pdf') {
                try {
                    console.log('Parsing PDF file:', file.originalname);
                    const pdfContent = await parsePDF(content);
                    console.log('PDF parsed successfully');
                    return pdfContent;
                } catch (error) {
                    console.error('Error parsing PDF:', error);
                    throw new Error(`Failed to parse PDF: ${error.message}`);
                }
            }
            
            return content.toString();
        } catch (error) {
            console.error('Error extracting text from file:', error);
            throw new Error(`Failed to process file: ${error.message}`);
        }
    }

    async saveFile(file) {
        try {
            console.log('Saving file:', file.originalname);
            const id = Math.random().toString(36).substr(2, 9);
            const content = await this.extractTextFromFile(file);
            
            this.uploadedFiles.set(id, {
                id,
                name: file.originalname,
                content,
                path: file.path || `memory-${id}` // Use a virtual path for memory storage
            });

            console.log('File saved successfully:', file.originalname);
            return {
                id,
                name: file.originalname
            };
        } catch (error) {
            console.error('Error saving file:', error);
            throw error;
        }
    }

    async deleteFile(id) {
        try {
            const file = this.uploadedFiles.get(id);
            if (!file) {
                throw new Error('File not found');
            }

            // Only try to delete from disk if it's a real file
            if (file.path && !file.path.startsWith('memory-')) {
                await unlink(file.path);
            }
            
            this.uploadedFiles.delete(id);
            return true;
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }

    getFile(id) {
        return this.uploadedFiles.get(id);
    }

    getAllFiles() {
        return Array.from(this.uploadedFiles.values());
    }
}

export const fileService = new FileService(); 