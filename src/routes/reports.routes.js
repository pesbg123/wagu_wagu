const express = require('express');
const router = express.Router();
const ReportsController = require('../controllers/reports.controller');
const reportsController = new ReportsController();

// POST reportPost
router.post('/posts/:post_id/reports', reportsController.reportPost.bind(reportsController));

// POST reportComment
router.post('/posts/:post_id/comments/:comment_id/reports', reportsController.reportComment.bind(reportsController));

// GET reports
router.get('/reports', reportsController.getReportList.bind(reportsController));

module.exports = router;
