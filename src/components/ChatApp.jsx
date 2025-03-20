
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Header from './Header';
import LoginForm from './LoginForm';
import ChatInterface from './ChatInterface';
import { initiateSocket, disconnectSocket } from '../utils/socket';

const ChatApp = () => {
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        handleLogin(parsedUser.username);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('chatUser');
      }
    }
  }, []);

  const handleLogin = (username) => {
    // Generate a random user ID
    const userId = 'user_' + Math.random().toString(36).substr(2, 9);
    const newUser = { userId, username };
    
    // Save to localStorage
    localStorage.setItem('chatUser', JSON.stringify(newUser));
    
    // Connect socket
    initiateSocket(userId, username);
    setUser(newUser);
    setIsConnected(true);
    
    toast.success(`Welcome, ${username}!`);
  };

  const handleLogout = () => {
    // Disconnect socket
    disconnectSocket();
    
    // Clear user data
    localStorage.removeItem('chatUser');
    setUser(null);
    setIsConnected(false);
    
    toast.info('You have been logged out');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header 
        username={user?.username} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {!user ? (
          <div className="h-full flex items-center justify-center">
            <LoginForm onLogin={handleLogin} />
          </div>
        ) : (
          <div className="h-[calc(100vh-12rem)] max-w-4xl mx-auto">
            <ChatInterface 
              userId={user.userId}
              username={user.username}
            />
          </div>
        )}
      </main>
      
      <footer className="py-4 px-6 text-center text-sm text-gray-500">
        <p>MessageFlow &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default ChatApp;
