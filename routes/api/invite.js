const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const playdateInviteController = require('../../controllers/playdateInviteController');

router.get('/', playdateInviteController.handlePlayDateInvite);

module.exports = router;