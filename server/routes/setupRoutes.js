const express = require('express');
const { getSetupStatus, completeSetup } = require('../controllers/setupController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();
router.get('/status', getSetupStatus);
router.post('/', protect, authorize('SUPER_ADMIN', 'INSTITUTION_ADMIN', 'admin'), completeSetup);
module.exports = router;
