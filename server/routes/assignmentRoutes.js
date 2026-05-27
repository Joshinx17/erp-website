const express = require('express');
const { getAssignments, getAssignment, createAssignment, updateAssignment, deleteAssignment, getClassAssignments } = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', protect, getAssignments);
router.get('/class/:classId', protect, getClassAssignments);
router.get('/:id', protect, getAssignment);
router.post('/', protect, authorize('teacher', 'admin'), upload.single('file'), createAssignment);
router.put('/:id', protect, authorize('teacher', 'admin'), upload.single('file'), updateAssignment);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteAssignment);

module.exports = router;
