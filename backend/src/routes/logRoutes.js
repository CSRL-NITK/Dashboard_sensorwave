const express = require('express');
const { getLogs, deleteLogs } = require('../controllers/logController');
const { checkPermission } = require('../middlewares/role&perm');
const router = express.Router();

const rolesAssigned = ['Admin', 'Vendor'];
router.get('/getLogs', checkPermission('read:log'), getLogs);
router.delete('/deleteLogs', checkPermission('delete:log'), deleteLogs);

module.exports = router;