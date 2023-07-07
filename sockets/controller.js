const { Socket } = require('socket.io');
const { validateToken } = require('../helpers');
const { Chat } = require('../models');

const chat = new Chat();

const socketController = async (socket = new Socket(), io) => {
  // console.log(socket.handshake.headers['token']);
  const token = socket.handshake.headers['token'];
  const user = await validateToken(token);

  if (!user) return socket.disconnect();

  // Add user when connecting
  chat.connectUser(user);
  io.emit('active-users', chat.usersToArray); // Emit to all users connected to the chat room
  socket.emit('receive-messages', chat.last10Messages); // Emit to the user who just connected to the chat room

  socket.join(user.id); // Join to a room with the user id as the room name

  socket.on('disconnect', () => {
    // Clear user when disconnecting
    chat.disconnectUser(user.id);
    io.emit('active-users', chat.usersToArray);
  });

  socket.on('send-message', ({ uidToPrivateMessage, message }) => {
    if (uidToPrivateMessage) {
      chat.sendMessage(user.id, user.name, message);

      // Private message
      socket
        .to(uidToPrivateMessage)
        .emit('private-message', { from: user.name, message });
      return;
    }

    chat.sendMessage(user.id, user.name, message);
    io.emit('receive-messages', chat.last10Messages);
  });
};

module.exports = {
  socketController,
};
