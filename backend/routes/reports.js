const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportController');

router.post('/schedule', controller.scheduleReport);

module.exports = router;
