const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const playdateController = require('../../controllers/playdateController');

router.route('/')
    .post(playdateController.handlePlayDate);

router.route('/:userId')
    .get(playdateController.handlePlayDateInvite);

//Had to do it this way or it just kept reading the handlePlayDateInvite instead
router.route('/:userId/:userId')
    .get(playdateController.handlePlayDateInviteUsersDates);

router.route('/:play_date_id')
    .post(playdateController.confirmPlayDateInvite);



module.exports = router;