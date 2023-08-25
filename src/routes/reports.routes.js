const express = require('express');
const router = express.Router();
const ReportsController = require('../controllers/reports.controller');
const reportsController = new ReportsController();

router.post('/');

module.exports = router;
