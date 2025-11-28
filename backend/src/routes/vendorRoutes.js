const express = require('express');
const { getAllVendors, getInfoVendor, getParticularVendor, updateVendor } = require('../controllers/vendorController');
const { checkPermission } = require('../middlewares/role&perm');
const router = express.Router();

router.get('/getAllVendors', checkPermission('read:vendor'), getAllVendors);
router.get('/getInfoVendor', checkPermission('read:info_vendor'), getInfoVendor);
router.post('/getParticularVendor', checkPermission('read:vendor'), getParticularVendor);
router.put('/updateVendor', checkPermission('edit:vendor'), updateVendor);

module.exports = router;