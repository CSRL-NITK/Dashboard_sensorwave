const { userSocketArray } = require('../../store/socketStore');

module.exports = function resolvedNotificationHandler(socket) {
  socket.on("resolvedNotificationByVendorOnly", data => {
    data.forEach(obj => {
      const userSocketId = userSocketArray[obj.receiver];
      if (userSocketId) {
        socket.to(userSocketId).emit("sendingNotificationToSpecificUser", obj);
      }
    });
  });
};
