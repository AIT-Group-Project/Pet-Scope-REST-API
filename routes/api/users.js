const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const usersController = require('../../controllers/usersController');

router.get('/', usersController.handleUsers);

module.exports = router;