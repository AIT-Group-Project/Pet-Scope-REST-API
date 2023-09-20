const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const profileController = require('../../controllers/profileController');
const fileUpload = require('express-fileupload');

router.use(fileUpload());
router.post('/', profileController.handleProfile);

module.exports = router;