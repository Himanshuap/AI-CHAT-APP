const { io } = require('socket.io-client');

const token = process.argv[2];

const socket = io('http://localhost:5000', { auth: { token } });

socket.on('connect', () => {
  console.log('✅ connected:', socket.id);
  socket.disconnect();
});

socket.on('connect_error', (err) => {
  console.log('❌ refused:', err.message);
  socket.disconnect();
});