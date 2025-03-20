
import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { subscribeToChat, sendMessage } from '../utils/socket';

const ChatInterface = ({ userId, username }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Subscribe to incoming messages
    subscribeToChat((msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Add welcome message
    const welcomeMsg = {
      userId: 'system',
      username: 'System',
      text: `Welcome to the chat, ${username}!`,
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMsg]);

    // Cleanup on unmount
    return () => {
      // This will be handled by the parent component
    };
  }, [username]);

  const handleSendMessage = (text) => {
    const newMessage = {
      userId,
      username,
      text,
      timestamp: new Date().toISOString()
    };
    
    // Add message to local state immediately for responsiveness
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    
    // Send to server
    sendMessage(newMessage);
  };

  return (
    <div className="flex flex-col bg-gray-50 rounded-lg shadow-sm h-full overflow-hidden">
      <div className="p-4 bg-white border-b border-gray-200">
        <h2 className="text-lg font-medium">Live Chat</h2>
        <p className="text-sm text-gray-500">
          {messages.length > 1 ? `${messages.length - 1} messages` : 'No messages yet'}
        </p>
      </div>
      
      <MessageList 
        messages={messages} 
        currentUser={userId}
      />
      
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatInterface;
