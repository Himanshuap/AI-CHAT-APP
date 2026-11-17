require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const initSocket = require('./sockets');

async function start() {
  await connectDB();

  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: '*' } });
  initSocket(io);

  server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}

start();