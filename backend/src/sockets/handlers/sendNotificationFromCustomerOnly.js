const { vendorSocketArray } = require('../../store/socketStore');

module.exports = function customerToVendorHandler(socket, io) {
  socket.on('sendNotificationFromCustomerOnly', (data) => {
    const sendingTo = vendorSocketArray[data.receiver];
    if (sendingTo) {
      io.to(sendingTo).emit('receiveNotificationOnVendorEndOnly', data);
    }
  });
};
