const express = require('express');
const { getResults, getResult, createResult, updateResult, deleteResult, getMyResults } = require('../controllers/resultController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getResults);
router.get('/my', protect, authorize('student'), getMyResults);
router.get('/:id', protect, getResult);
router.post('/', protect, authorize('teacher', 'admin'), createResult);
router.put('/:id', protect, authorize('teacher', 'admin'), updateResult);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteResult);

module.exports = router;
