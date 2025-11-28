const express = require('express');
const router = express.Router();
const { getAllCustomers, getYourVendorIfYouAreCustomer, getInfoCustomer } = require("../controllers/customerController");
const { checkPermission } = require('../middlewares/role&perm');

const rolesAssigned = ['Admin', 'Vendor'];
router.get('/getAllCustomers/:vendor_id', checkPermission('read:customer'), getAllCustomers);
router.post('/getYourVendorIfYouAreCustomer',checkPermission('read:customer'), getYourVendorIfYouAreCustomer);
router.get("/getInfoCustomer",checkPermission('read:info_customer'), getInfoCustomer);

module.exports = router;