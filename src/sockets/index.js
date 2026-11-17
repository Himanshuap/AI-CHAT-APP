const socketAuth = require('./socketAuth');
const registerMessageHandlers = require('./messageHandler');

function initSocket(io) {
  io.use(socketAuth);

  io.on('connection', (socket) => {
    console.log('socket connected:', socket.id, 'user:', socket.userId);

    registerMessageHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log('socket disconnected:', socket.id);
    });
  });
}

module.exports = initSocket;