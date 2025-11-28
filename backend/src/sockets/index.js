const identifyHandler = require('./handlers/identify');
const customerToVendorHandler = require('./handlers/sendNotificationFromCustomerOnly');
const resolvedNotificationHandler = require('./handlers/resolvedNotificationByVendorOnly');
const disconnectHandler = require('./handlers/disconnect');
const vendorToAdmin = require('./handlers/vendorToAdmin');
const adminToVendor = require('./handlers/adminToVendor');
const sendReply = require('./handlers/sendReply');

module.exports = function socketMain(io) {
  io.on('connection', (socket) => {
    identifyHandler(socket);
    customerToVendorHandler(socket, io);
    resolvedNotificationHandler(socket);
    sendReply(socket, io);
    vendorToAdmin(socket, io);
    adminToVendor(socket, io);
    disconnectHandler(socket);
  });
};
