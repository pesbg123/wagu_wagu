const express = require('express');
const router = express.Router();
const ReportsController = require('../controllers/reports.controller');
const reportsController = new ReportsController();

const AcountMiddleware = require('../middlewares/account.middleware');
const acountMiddleware = new AcountMiddleware();

// POST reportPost
router.post('/posts/:post_id/reports', acountMiddleware.authenticateAccessToken, reportsController.reportPost.bind(reportsController));

// POST reportComment
router.post(
  '/posts/:post_id/comments/:comment_id/reports',
  acountMiddleware.authenticateAccessToken,
  reportsController.reportComment.bind(reportsController),
);

// GET reports
router.get('/reports', acountMiddleware.isAdmin, acountMiddleware.authenticateAccessToken, reportsController.getReportList.bind(reportsController));

module.exports = router;
