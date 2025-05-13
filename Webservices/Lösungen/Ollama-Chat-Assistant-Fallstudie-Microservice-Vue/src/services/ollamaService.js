import fetch from 'node-fetch';
import { config } from '../config/config.js';

export class OllamaService {
    async generateResponse(prompt, context, type = 'local') {
        try {
            let fullPrompt = prompt;
            if (context) {
                fullPrompt = `Context:\n${context}\n\nQuestion: ${prompt}`;
            }

            const ollamaUrl = type === 'local' 
                ? config.ollamaUrls.local 
                : config.ollamaUrls.external;

            const response = await fetch(`${ollamaUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: config.modelName,
                    prompt: fullPrompt,
                    stream: false,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Error generating response:', error);
            throw new Error('Failed to generate response from Ollama');
        }
    }
}

export const ollamaService = new OllamaService(); 