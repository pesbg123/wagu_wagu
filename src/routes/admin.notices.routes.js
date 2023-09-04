const express = require('express');
const router = express.Router();
const AdminNotices = require('../controllers/admin.notices.controller');
const adminNotices = new AdminNotices();

const AcountMiddleware = require('../middlewares/account.middleware');
const acountMiddleware = new AcountMiddleware();

// create Notice
router.post('/adminNotices', acountMiddleware.isAdmin, acountMiddleware.authenticateAccessToken, adminNotices.createAdminNotice.bind(adminNotices));

// findAll all_Notice - admin page
router.get(
  '/admin/adminNotices',
  acountMiddleware.isAdmin,
  acountMiddleware.authenticateAccessToken,
  adminNotices.getAdminNoticeList.bind(adminNotices),
);

// findAll notice - not deleted
router.get('/adminNotices', acountMiddleware.isAdmin, acountMiddleware.authenticateAccessToken, adminNotices.getAdminNotices.bind(adminNotices));

// findAll notice - deleted  <- 일단 만들어둠
router.get(
  '/adminNotices/deleted',
  acountMiddleware.isAdmin,
  acountMiddleware.authenticateAccessToken,
  adminNotices.getDeletedAdminNotices.bind(adminNotices),
);

// findOne notice - not deleted
router.get('/adminNotices/:id', acountMiddleware.isAdmin, acountMiddleware.authenticateAccessToken, adminNotices.getAdminNotice.bind(adminNotices));

// update notice
router.put(
  '/adminNotices/:id',
  acountMiddleware.isAdmin,
  acountMiddleware.authenticateAccessToken,
  adminNotices.updateAdminNotice.bind(adminNotices),
);

// soft delete notice
router.delete(
  '/adminNotices/:id',
  acountMiddleware.isAdmin,
  acountMiddleware.authenticateAccessToken,
  adminNotices.deleteAdminNotice.bind(adminNotices),
);

// hard delete notice
router.delete(
  '/adminNotices/:id/delete',
  acountMiddleware.isAdmin,
  acountMiddleware.authenticateAccessToken,
  adminNotices.hardDeleteAdminNotice.bind(adminNotices),
);

module.exports = router;
