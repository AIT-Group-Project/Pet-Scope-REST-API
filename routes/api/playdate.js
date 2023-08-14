const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const playdateController = require('../../controllers/playdateController');

router.post('/', playdateController.handlePlayDate);

module.exports = router;