
import React, { useState } from 'react';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    onSendMessage(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white/50 backdrop-blur-sm border-t border-gray-200">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          className="input-field flex-1"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoFocus
        />
        <button 
          type="submit" 
          className="btn-primary py-3"
          disabled={!message.trim()}
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
