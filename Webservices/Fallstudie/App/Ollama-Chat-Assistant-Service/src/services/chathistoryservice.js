import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath from 'url';

const __dirname=path.dirname(fileURLPath(import.meta.url));

const HISTORY_FILE=path.join(__dirname, '../../chat_history.json');

export class ChatHistoryService {
	
	constructor(){
		this.history=[];
	}
    
    async loadHistory(){
		const data = await fs.readFile(HISTORY_FILE,'utf-8');
		
		this.history=JSON.parse(data);
	
	}		
	
	async saveHistory(){	
	 await fs.mkdir(path.dirname(HISTORY_FILE), recursive: true});
	 await fs.writeFile(HISTORY_FILE, JSON.stringify(this.history,null,2));
	}
	
	
	async addMessage(content){
		this.history.push({
			content,
			timestamp: new Date().toISOString()
		});
		
		await this.saveHistory();
	}
	
	getHistory(){
		return this.history;
	}
	
	clearHistory(){
	  this.history=[];
	  return this.history();
	}
	
		
}

export const chatHistoryService = new ChatHistoryService();