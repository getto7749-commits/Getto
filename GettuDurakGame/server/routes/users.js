const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/daily-reward', auth, userController.getDailyReward);
router.get('/leaderboard', userController.getLeaderboard);

module.exports = router;