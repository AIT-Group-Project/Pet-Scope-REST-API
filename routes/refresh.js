const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const refreshTokenController = require('../controllers/refreshTokenController');

router.get('/', refreshTokenController.handleRefreshToken);

module.exports = router;