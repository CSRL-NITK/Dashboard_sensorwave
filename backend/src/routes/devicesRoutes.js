const express = require('express')
const router = express.Router();
const { getAllDevices, insertDevice, deleteDevices } = require("../controllers/devicesController");
const { checkPermission } = require('../middlewares/role&perm');

const rolesAssigned = ['Admin', 'Vendor'];
router.get("/getAllDevices/:customer_id", checkPermission('read:device'), getAllDevices);
router.post("/insertDevice", checkPermission('create:device'), insertDevice);
router.post("/deleteDevices", checkPermission('delete:device'), deleteDevices);

module.exports = router;
