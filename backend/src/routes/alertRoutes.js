const express = require('express');
const { resolveAlerts, updateAlerts, deleteAlerts, getAlertsForUser, getAlertsForVendor, insertAlerts } = require('../controllers/alertContoller');
const { checkPermission } = require('../middlewares/role&perm');
const router = express.Router();
const rolesAssigned = ['Admin', 'Vendor'];
router.put("/resolveAlerts", checkPermission('update:alert'), resolveAlerts);
router.put("/updateAlerts", checkPermission('update:alert_status'), updateAlerts);
router.post("/deleteAlerts", checkPermission('delete:alert'), deleteAlerts);
router.get('/getAlertsForUser', checkPermission('read:alert_cust'), getAlertsForUser);
router.get('/getAlertsForVendor', checkPermission('read:alert_vendor'), getAlertsForVendor);
router.post('/insertAlerts', checkPermission('create:alert'), insertAlerts);

module.exports = router;