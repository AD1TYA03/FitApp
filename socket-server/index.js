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

  socket.on('locationUpdate', (data) => {
    console.log('Location update received:', data);
    io.emit('locationUpdate', data); // Broadcast to all connected clients
  });

  socket.on('chatMessage', (data) => {
    console.log('Chat message received:', data);
    io.emit('chatMessage', data); // Broadcast to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});