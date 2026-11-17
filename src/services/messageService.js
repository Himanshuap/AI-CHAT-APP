const Message = require('../models/Message');

async function sendMessage({ text, senderId }) {
  const message = await Message.create({ text, sender: senderId });
  return message.populate('sender', 'name');
}

async function getMessages() {
  return Message.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('sender', 'name');
}

module.exports = { sendMessage, getMessages };