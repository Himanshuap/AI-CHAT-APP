const { io } = require('socket.io-client');

const [mode, token, text] = process.argv.slice(2);
const socket = io('http://localhost:5000', { auth: { token } });

socket.on('connect_error', (err) => console.log('❌ refused:', err.message));

if (mode === 'listen') {
  socket.on('connect', () => console.log('👂 listening...'));
  socket.on('message:new', (msg) => console.log(`📩 ${msg.sender.name}: ${msg.text}`));
}

if (mode === 'send') {
  socket.on('connect', () => {
    socket.emit('message:send', { text }, (res) => {
      console.log('ack:', res);
      socket.disconnect();
    });
  });
}