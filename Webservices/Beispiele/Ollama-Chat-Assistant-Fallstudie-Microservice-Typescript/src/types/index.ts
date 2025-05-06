// Grundlegende Typen für Nachrichten
export interface Message {
  role: 'user' | 'bot';
  content: string;
  loading?: boolean;
}

// Typ für hochgeladene Dateien
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

// Typ für die Props der App-Komponente
export interface AppProps {
  // Da die App keine Props erwartet, lassen wir diese leer
}

// Typ für die Props der ChatInterface-Komponente
export interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => Promise<void>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

// Typ für die Props der FileUpload-Komponente
export interface FileUploadProps {
  uploadedFiles: Map<string, UploadedFile>;
  onFileUpload: (files: FileList) => Promise<void>;
  onRemoveFile: (fileId: string) => Promise<void>;
}

// Typ für die Props der ModelSelector-Komponente
export interface ModelSelectorProps {
  currentModel: string;
  onModelChange: (model: string) => void;
} 