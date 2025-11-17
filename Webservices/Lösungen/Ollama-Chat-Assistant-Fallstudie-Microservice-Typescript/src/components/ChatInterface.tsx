import React, { useState } from 'react';
import { ChatInterfaceProps, Message } from '../types';

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  messagesEndRef 
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [showOnlyBotMessages, setShowOnlyBotMessages] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (inputValue.trim()) {
      await onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const filteredMessages = showOnlyBotMessages
    ? messages.filter((message) => message.role === 'bot')
    : messages;

  return (
    <div className="chat-interface">
      <button
        className="filter-button"
        onClick={() => setShowOnlyBotMessages((prev) => !prev)}
      >
        {showOnlyBotMessages ? 'Alle Nachrichten anzeigen' : 'Nur Bot-Nachrichten anzeigen'}
      </button>
      <div className="chat-messages">
        {filteredMessages.map((message: Message, index: number) => (
          <div 
            key={index} 
                className={`message ${message.role}-message ${message.loading ? 'loading' : ''}`}
          >
            <div className="message-content">
              {message.loading ? (
                <div className="loading-dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
          <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface; 