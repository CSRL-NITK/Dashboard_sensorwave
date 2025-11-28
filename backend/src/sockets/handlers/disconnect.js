const logger = require('../../logs');
const { userSocketArray, vendorSocketArray, adminSocketArray } = require('../../store/socketStore');
// const { adminSocketId } = require('../../store/socketStore');

module.exports = function disconnectHandler(socket) {
  socket.on('disconnect', () => {
    for (const [userId, socketId] of Object.entries(userSocketArray)) {
      if (socketId === socket.id) {
        delete userSocketArray[userId];
        logger.info(`User disconnected ${userId}`);
        break;
      }
    }

    for (const [vendorId, socketId] of Object.entries(vendorSocketArray)) {
      if (socketId === socket.id) {
        delete vendorSocketArray[vendorId];
        logger.info(`Vendor disconnected ${vendorId}`);
        break;
      }
    }

    for (const [adminId, socketId] of Object.entries(adminSocketArray)) {
      if (socketId === socket.id) {
        delete adminSocketArray[adminId];
        logger.info(`Admin disconnected ${adminId}`);
        break;
      }
    }
  });
};
