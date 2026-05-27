const express = require('express');
const { getNotifications, createNotification, deleteNotification } = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getNotifications);
router.post('/', protect, authorize('admin', 'teacher'), createNotification);
router.delete('/:id', protect, authorize('admin'), deleteNotification);

module.exports = router;
