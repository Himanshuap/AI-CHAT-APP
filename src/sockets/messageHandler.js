const messageService = require('../services/messageService');
const { messageSchema } = require('../validators/schemas');

function registerMessageHandlers(io, socket) {
  socket.on('message:send', async (data, ack) => {
    try {
      const result = messageSchema.safeParse(data);
      if (!result.success) {
        return ack?.({ error: result.error.issues[0].message });
      }

      const message = await messageService.sendMessage({
        text: result.data.text,
        senderId: socket.userId,
      });

      io.emit('message:new', message);
      ack?.({ ok: true });
    } catch (err) {
      console.error(err.message);
      ack?.({ error: 'Could not send message' });
    }
  });
}

module.exports = registerMessageHandlers;