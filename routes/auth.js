const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/', authController.handleLogin);

module.exports = router;