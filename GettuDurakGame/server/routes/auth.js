const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/login', authController.authenticate);
router.get('/profile', auth, authController.getProfile);

module.exports = router;