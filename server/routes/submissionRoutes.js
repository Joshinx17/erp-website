const express = require('express');
const { submitAssignment, getSubmissions, gradeSubmission, getMySubmissions } = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', protect, authorize('student'), upload.single('file'), submitAssignment);
router.get('/', protect, getSubmissions);
router.get('/my', protect, authorize('student'), getMySubmissions);
router.put('/:id/grade', protect, authorize('teacher', 'admin'), gradeSubmission);

module.exports = router;
