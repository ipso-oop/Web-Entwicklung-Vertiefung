import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HISTORY_FILE = path.join(__dirname, '../../data/chat_history.json');

export class ChatHistoryService {
    constructor() {
        this.history = [];
        this.loadHistory();
    }

    async loadHistory() {
        try {
            const data = await fs.readFile(HISTORY_FILE, 'utf-8');
            this.history = JSON.parse(data);
        } catch (error) {
            // If file doesn't exist or is invalid, start with empty history
            this.history = [];
            await this.saveHistory();
        }
    }

    async saveHistory() {
        try {
            // Ensure directory exists
            await fs.mkdir(path.dirname(HISTORY_FILE), { recursive: true });
            await fs.writeFile(HISTORY_FILE, JSON.stringify(this.history, null, 2));
        } catch (error) {
            console.error('Error saving chat history:', error);
            throw error;
        }
    }

    async addMessage(role, content) {
        this.history.push({
            role,
            content,
            timestamp: new Date().toISOString()
        });
        await this.saveHistory();
    }

    getHistory() {
        return this.history;
    }

    clearHistory() {
        this.history = [];
        return this.saveHistory();
    }
}

export const chatHistoryService = new ChatHistoryService(); 