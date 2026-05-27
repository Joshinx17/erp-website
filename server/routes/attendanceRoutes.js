const express = require('express');
const { markAttendance, getAttendance, updateAttendance, getMyAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('teacher', 'admin'), markAttendance);
router.get('/', protect, getAttendance);
router.put('/:id', protect, authorize('teacher', 'admin'), updateAttendance);
router.get('/my/:studentId', protect, getMyAttendance);

module.exports = router;
