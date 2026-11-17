const path = require('path'); 
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public'))); 

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/messages', messageRoutes); 

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Something went wrong' : err.message,
  });
});

module.exports = app;