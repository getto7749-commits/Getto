const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const auth = require('../middleware/auth');

router.post('/create-table', auth, gameController.createTable);
router.get('/tables', gameController.getTables);
router.get('/table/:tableId', gameController.getGameDetails);

module.exports = router;