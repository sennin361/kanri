// server.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
// const { createClient } = require('redis');
// const { createAdapter } = require('@socket.io/redis-adapter');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

/*
// Redis 接続設定
const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

(async () => {
  try {
    await pubClient.connect();
    await subClient.connect();
    io.adapter(createAdapter(pubClient, subClient));
    console.log('✅ Redis adapter connected');
  } catch (err) {
    console.error('❌ Redis connection failed:', err);
  }
})();
*/

// Socket.IOイベント
io.on('connection', (socket) => {
  console.log(`🟢 接続: ${socket.id}`);

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`${socket.id} joined room: ${room}`);
  });

  socket.on('chatMessage', ({ room, message }) => {
    io.to(room).emit('chatMessage', {
      sender: socket.id,
      message,
    });
  });

  socket.on('disconnect', () => {
    console.log(`🔴 切断: ${socket.id}`);
  });
});

// サーバー起動
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 管理サーバー起動: http://localhost:${PORT}`);
});
