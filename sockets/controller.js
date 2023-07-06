const { validateToken } = require('../helpers');
const { Chat } = require('../models');

const chat = new Chat();

const socketController = async (socket, io) => {
  // console.log(socket.handshake.headers['token']);
  const token = socket.handshake.headers['token'];
  const user = await validateToken(token);

  if (!user) return socket.disconnect();

  chat.connectUser(user);
  io.emit('active-users', chat.usersToArray);

  socket.on('disconnect', () => {
    chat.disconnectUser(user.id);
    io.emit('active-users', chat.usersToArray);
  });
};

module.exports = {
  socketController,
};
