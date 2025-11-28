const express = require('express');
const router = express.Router();
const { insertAllSensors } = require('../controllers/sensorController');
const { checkPermission } = require('../middlewares/role&perm');


const rolesAssigned = ['Admin', 'Vendor'];
router.post('/insertAllSensors', checkPermission('create:sensor'), insertAllSensors);

module.exports = router;