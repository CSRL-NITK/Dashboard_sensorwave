const { adminSocketArray, vendorSocketArray, userSocketArray } = require('../../store/socketStore');
const logger = require('../../logs/index');
module.exports = function identifyHandler(socket) {
    socket.on('identify', (data) => {
        // console.info(data);
        if (!data || !data.role || !data.uniqueId) {
            socket.emit('error', 'Invalid identification payload');
            return;
        }

        if (data.role === 'Admin') {
            logger.info(`Admin connected : ${data.uniqueId}`);
            adminSocketArray[data.uniqueId] = socket.id;
        } else if (data.role === 'Vendor') {
            vendorSocketArray[data.uniqueId] = socket.id;
            logger.info(`Vendor Connected : ${data.uniqueId}`);
        } else {
            userSocketArray[data.uniqueId] = socket.id;
            logger.info(`Customer connected: ${data.uniqueId}`);
        }
    });
};
