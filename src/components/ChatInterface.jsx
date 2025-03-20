
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { subscribeToChat, sendMessage, getSocket } from '../utils/socket';

const ChatInterface = ({ userId, username }) => {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    console.log('ChatInterface mounted, subscribing to chat');
    
    // Subscribe to incoming messages
    subscribeToChat((msg) => {
      console.log('Message received in ChatInterface:', msg);
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

    // Listen for user joined events
    const socket = getSocket();
    if (socket) {
      socket.on('user-joined', (user) => {
        const joinMsg = {
          userId: 'system',
          username: 'System',
          text: `${user.username} has joined the chat`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, joinMsg]);
        toast.info(`${user.username} has joined`);
        
        // Update online users
        setOnlineUsers(prev => [...prev, user]);
      });

      socket.on('user-left', (user) => {
        const leaveMsg = {
          userId: 'system',
          username: 'System',
          text: `${user.username} has left the chat`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, leaveMsg]);
        toast.info(`${user.username} has left`);
        
        // Update online users
        setOnlineUsers(prev => prev.filter(u => u.userId !== user.userId));
      });
      
      socket.on('online-users', (users) => {
        setOnlineUsers(users);
      });
    }

    // Cleanup on unmount
    return () => {
      console.log('ChatInterface unmounting, cleaning up listeners');
      const socket = getSocket();
      if (socket) {
        socket.off('message');
        socket.off('user-joined');
        socket.off('user-left');
        socket.off('online-users');
      }
    };
  }, [username]);

  const handleSendMessage = (text) => {
    console.log('Handling send message:', text);
    const newMessage = {
      userId,
      username,
      text,
      timestamp: new Date().toISOString()
    };
    
    // Send to server
    sendMessage(newMessage);
    
    // Also add to local messages immediately for a more responsive feel
    // This will be replaced when the server echoes it back
    console.log('Adding message locally:', newMessage);
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <div className="flex flex-col bg-gray-50 rounded-lg shadow-sm h-full overflow-hidden">
      <div className="p-4 bg-white border-b border-gray-200">
        <h2 className="text-lg font-medium">Live Chat</h2>
        <p className="text-sm text-gray-500">
          {messages.length > 1 ? `${messages.length - 1} messages` : 'No messages yet'}
        </p>
        {onlineUsers.length > 0 && (
          <div className="mt-1 text-xs text-gray-500">
            {onlineUsers.length} user{onlineUsers.length !== 1 ? 's' : ''} online
          </div>
        )}
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
