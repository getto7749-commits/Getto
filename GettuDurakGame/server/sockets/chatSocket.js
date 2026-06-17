const Chat = require('../models/Chat');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // Send message
    socket.on('sendMessage', async (data) => {
      try {
        const { userId, username, message, tableId } = data;

        // Save to database
        const chat = new Chat({
          userId,
          username,
          message,
          tableId
        });
        await chat.save();

        // Emit to all users in table
        io.to(tableId).emit('messageReceived', {
          username,
          message,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Chat error:', error);
      }
    });

    // Get recent messages
    socket.on('getMessages', async (data) => {
      try {
        const { tableId } = data;
        const messages = await Chat.find({ tableId })
          .sort({ createdAt: -1 })
          .limit(50)
          .select('username message createdAt');

        socket.emit('messagesLoaded', {
          messages: messages.reverse()
        });
      } catch (error) {
        console.error('Get messages error:', error);
      }
    });
  });
};