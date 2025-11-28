const { vendorSocketArray } = require("../../store/socketStore");

module.exports = function adminToVendorHandler(socket, io) {
    socket.on("FromAdminToVendor", data => {
        const sendingTo = vendorSocketArray[data.receiver];
        if(sendingTo){
            io.to(sendingTo).emit("NotificationFromAdmin", data);
        }
    });
}