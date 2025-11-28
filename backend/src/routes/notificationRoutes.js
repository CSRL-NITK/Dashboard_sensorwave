const express = require('express');
const { getNotificationsForUser, insertNotification, readNotification, insertManyNotification, sendReplyTo, readMany, deleteNotification } = require('../controllers/notificationController');
const { checkPermission } = require('../middlewares/role&perm');
const router = express.Router();

router.post('/insertNotification', checkPermission('create:notification'), insertNotification);
router.post('/insertManyNotification', checkPermission('create:notification'), insertManyNotification);
router.post('/getNotificationsForUser', checkPermission('read:notification'), getNotificationsForUser);
router.post('/readNotification', checkPermission('update:notification'), readNotification);
router.post('/sendReply', checkPermission('access:reply'), sendReplyTo);
router.post('/readMany', checkPermission('update:notification'), readMany);
router.post('/deleteNotification', checkPermission('delete:notification'), deleteNotification);


module.exports = router;