const express = require('express');
const router = express.Router();
const { createUser, deleteUser, createVendor, deleteVendor, resetPassword } = require('../controllers/auth0Controller');
const { checkPermission } = require('../middlewares/role&perm');
router.post('/create-user', checkPermission('create:customer'), createUser);
router.post('/delete-user', checkPermission('delete:customer'), deleteUser);

router.post('/create-vendor', checkPermission('create:vendor'), createVendor);
router.delete('/delete-vendor/:vendor_id', checkPermission('create:vendor'), deleteVendor);

router.patch('/reset-password', resetPassword);

module.exports = router;
