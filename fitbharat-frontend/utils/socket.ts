import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = async (token: string) => {
  if (socket) return socket;

  socket = io('http://192.168.232.25:3001', {
    auth: {
      token: token, // Send token during handshake
    },
    transports: ['websocket'], // optional: ensures websocket usage
  });

  socket.on('connect', () => {
    console.log('✅ Connected to socket:', socket?.id);
  });

  socket.on('connect_error', (err) => {
    console.error('❌ Socket connection error:', err.message);
  });

  return socket;
};
