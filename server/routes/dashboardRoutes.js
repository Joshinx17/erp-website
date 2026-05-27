const express = require('express');
const { getAdminDashboard, getTeacherDashboard, getStudentDashboard } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/admin', protect, authorize('admin'), getAdminDashboard);
router.get('/teacher', protect, authorize('teacher'), getTeacherDashboard);
router.get('/student', protect, authorize('student'), getStudentDashboard);

module.exports = router;
