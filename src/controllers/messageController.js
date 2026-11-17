const messageService = require('../services/messageService');

async function sendMessage(req, res) {
  const message = await messageService.sendMessage({ text: req.body.text, senderId: req.userId });
  res.status(201).json(message);
}

async function getMessages(req, res) {
  const messages = await messageService.getMessages();
  res.json(messages);
}

module.exports = { sendMessage, getMessages };