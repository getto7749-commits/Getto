const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/messages', auth, (req, res) => {
  res.json({ messages: [] });
});

router.post('/send', auth, (req, res) => {
  res.json({ success: true });
});

module.exports = router;