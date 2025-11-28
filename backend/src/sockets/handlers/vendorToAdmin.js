const { adminSocketArray } = require('../../store/socketStore');

module.exports = function vendorToAdminHandler(socket, io) {
  socket.on('sendNotificationFromVendor', (data) => {
    const sendingTo = adminSocketArray[data.receiver];
    if (sendingTo) {
      io.to(sendingTo).emit('NotificationFromVendor', data);
    }
  });
};
