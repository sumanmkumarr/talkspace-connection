
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? true // Allow all origins in production
      : "http://localhost:5173", // Vite's default port for development
    methods: ["GET", "POST"]
  }
});

// Store connected users
const users = new Map();

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  const username = socket.handshake.query.username;
  
  // Add user to our in-memory store
  users.set(socket.id, { userId, username });
  
  console.log(`User connected: ${username} (${userId})`);
  
  // Notify all clients (except sender) about new user
  socket.broadcast.emit('user-joined', { userId, username });
  
  // Send current online users to the newly connected user
  const onlineUsers = Array.from(users.values());
  socket.emit('online-users', onlineUsers);
  
  // Handle messages
  socket.on('message', (message) => {
    // Broadcast message to all clients (including sender)
    io.emit('message', message);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      console.log(`User disconnected: ${user.username} (${user.userId})`);
      users.delete(socket.id);
      socket.broadcast.emit('user-left', user);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
