const express = require('express');
const { getExams, getExam, createExam, updateExam, deleteExam, getClassExams } = require('../controllers/examController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getExams);
router.get('/class/:classId', protect, getClassExams);
router.get('/:id', protect, getExam);
router.post('/', protect, authorize('teacher', 'admin'), createExam);
router.put('/:id', protect, authorize('teacher', 'admin'), updateExam);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteExam);

module.exports = router;
