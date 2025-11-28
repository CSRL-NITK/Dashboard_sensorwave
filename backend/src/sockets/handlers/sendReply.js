const { adminSocketArray, vendorSocketArray, userSocketArray } = require('../../store/socketStore');

module.exports = function sendReplyHandler(socket, io) {
  socket.on('SendReply', (data) => {
    const receiverId = data.receiver;

    const socketId =
      adminSocketArray[receiverId] ||
      vendorSocketArray[receiverId] ||
      userSocketArray[receiverId];
    if (socketId) {
      io.to(socketId).emit('recieveReply', data);
    }
  });
};

