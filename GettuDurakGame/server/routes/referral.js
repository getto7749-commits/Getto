const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const auth = require('../middleware/auth');

router.get('/code', auth, referralController.getReferralCode);
router.post('/claim', auth, referralController.claimReferral);

module.exports = router;