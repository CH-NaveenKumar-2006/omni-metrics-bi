const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('../controllers/importController');

const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/csv', upload.single('file'), controller.importCSV);
router.post('/sql-query', controller.runSQLQuery);

module.exports = router;
