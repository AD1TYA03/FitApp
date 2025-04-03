// server.js (Node.js with Socket.IO)

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust this for production
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle chat messages
  socket.on('chatMessage', (data) => {
    console.log('Chat message received:', data);
    // Add a unique ID to the message on the server-side before broadcasting.
    const messageWithId = {
        ...data,
        message:{
            ...data.message,
            id: Date.now().toString() + Math.random().toString(36).substring(2, 15) // Generate a basic unique ID
        }
    };
    io.emit('chatMessage', messageWithId); // Broadcast to all connected clients
  });

  // Handle disconnects
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});