const express = require('express');
const { getStudents, getStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const { protect, requirePermission } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, requirePermission('student.read'), getStudents);
router.get('/:id', protect, getStudent);
router.put('/:id', protect, requirePermission('student.update'), updateStudent);
router.delete('/:id', protect, requirePermission('student.archive'), deleteStudent);

module.exports = router;
