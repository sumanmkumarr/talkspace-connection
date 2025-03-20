
import { io } from 'socket.io-client';

let socket;

export const initiateSocket = (userId, username) => {
  // Determine server URL based on environment
  // In production, we'll connect to the same domain
  const serverUrl = import.meta.env.PROD 
    ? window.location.origin // Use same domain as the app in production
    : 'http://localhost:5000'; // Use localhost for development
  
  socket = io(serverUrl, {
    query: { userId, username }
  });
  
  console.log('Connecting socket to:', serverUrl);
  
  socket.on('connect', () => {
    console.log('Socket connected!');
  });
  
  socket.on('user-joined', (user) => {
    console.log('User joined:', user);
  });

  socket.on('user-left', (user) => {
    console.log('User left:', user);
  });
  
  return socket;
};

export const disconnectSocket = () => {
  console.log('Disconnecting socket...');
  if (socket) socket.disconnect();
};

export const subscribeToChat = (callback) => {
  if (!socket) return;
  
  socket.on('message', msg => {
    console.log('Message received:', msg);
    callback(msg);
  });
};

export const sendMessage = (message) => {
  if (!socket) return;
  
  socket.emit('message', message);
};

export const getSocket = () => socket;
