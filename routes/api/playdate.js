const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const playdateController = require('../../controllers/playdateController');

router.route('/')
    .post(playdateController.handlePlayDate);


router.route('/:userId')
    .get(playdateController.handlePlayDateInvite);

module.exports = router;