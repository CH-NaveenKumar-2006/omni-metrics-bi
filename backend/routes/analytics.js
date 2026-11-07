const express = require('express');
const router = express.Router();
const controller = require('../controllers/analyticsController');

router.get('/kpis', controller.getKPIs);
router.get('/timeseries', controller.getTimeSeries);
router.get('/breakdowns', controller.getBreakdowns);

module.exports = router;
