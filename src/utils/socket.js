
import { io } from 'socket.io-client';

let socket;

export const initiateSocket = (userId, username) => {
  // For development, connecting to localhost
  socket = io('http://localhost:5000', {
    query: { userId, username }
  });
  
  console.log('Connecting socket...');
  
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
