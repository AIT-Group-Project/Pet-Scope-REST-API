const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const registerController = require('../controllers/registerController');

router.post('/', registerController.handleNewUser);

module.exports = router;