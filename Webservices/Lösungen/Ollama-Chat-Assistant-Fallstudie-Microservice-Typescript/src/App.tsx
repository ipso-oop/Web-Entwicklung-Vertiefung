import React, { useState, useEffect, useRef } from 'react';
import ChatInterface from './components/ChatInterface';
import FileUpload from './components/FileUpload';
import ModelSelector from './components/ModelSelector';
import { Message, UploadedFile, AppProps } from './types';
import './App.css';

const API_BASE_URL = 'http://localhost:3000';

const App: React.FC<AppProps> = () => {
  // Typisierung des States mit generischen Typen
  const [currentModel, setCurrentModel] = useState<string>('local');
  const [uploadedFiles, setUploadedFiles] = useState<Map<string, UploadedFile>>(new Map());
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/history/load`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.history);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveMessageToHistory = async (role: 'user' | 'bot', content: string): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/api/history/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role, content }),
      });
    } catch (error) {
      console.error('Error saving message to history:', error);
    }
  };

  const handleSendMessage = async (prompt: string): Promise<void> => {
    if (!prompt.trim()) return;

    // Add user message
    const userMessage: Message = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);
    await saveMessageToHistory('user', prompt);

    // Add loading message
    const loadingMessage: Message = { role: 'bot', content: 'Thinking...', loading: true };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const fileIds = Array.from(uploadedFiles.keys());
      const response = await fetch(`${API_BASE_URL}/api/chat/${currentModel}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt,
          fileIds
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // Replace loading message with actual response
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { role: 'bot', content: data.response };
        return newMessages;
      });
      
      await saveMessageToHistory('bot', data.response);
    } catch (error) {
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          role: 'bot', 
          content: 'Sorry, I encountered an error while processing your request. Please try again.' 
        };
        return newMessages;
      });
      console.error('Error:', error);
    }
  };

  const handleFileUpload = async (files: FileList): Promise<void> => {
    const formData = new FormData();
    for (const file of Array.from(files)) {
      formData.append('files', file);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      const newFiles = new Map(uploadedFiles);
      result.files.forEach((file: UploadedFile) => {
        newFiles.set(file.id, file);
      });
      setUploadedFiles(newFiles);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files. Please try again.');
    }
  };

  const handleRemoveFile = async (fileId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/files/${fileId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      const newFiles = new Map(uploadedFiles);
      newFiles.delete(fileId);
      setUploadedFiles(newFiles);
    } catch (error) {
      console.error('Error removing file:', error);
      alert('Failed to remove file. Please try again.');
    }
  };

  return (
    <div className="app">
      <div className="sidebar">
        <ModelSelector 
          currentModel={currentModel} 
          onModelChange={setCurrentModel} 
        />
        <FileUpload 
          uploadedFiles={uploadedFiles}
          onFileUpload={handleFileUpload}
          onRemoveFile={handleRemoveFile}
        />
      </div>
      <div className="main-content">
        <ChatInterface 
          messages={messages}
          onSendMessage={handleSendMessage}
          messagesEndRef={messagesEndRef}
        />
      </div>
    </div>
  );
};

export default App; 