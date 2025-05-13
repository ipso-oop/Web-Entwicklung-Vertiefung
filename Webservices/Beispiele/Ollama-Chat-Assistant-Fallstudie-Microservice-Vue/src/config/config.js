import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const config = {
    port: process.env.PORT || 3000,
    modelName: process.env.MODEL_NAME,
    ollamaUrls: {
        local: process.env.LOCAL_OLLAMA_URL,
        external: process.env.EXTERNAL_OLLAMA_URL
    },
    uploadDir: join(__dirname, '../../uploads'),
    paths: {
        public: join(__dirname, '../../public')
    }
}; 