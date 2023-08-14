const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const logoutController = require('../controllers/logoutController');

router.get('/', logoutController.handleLogout);

module.exports = router;