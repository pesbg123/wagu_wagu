const express = require('express');
const router = express.Router();
const AdminNotices = require('../controllers/admin.notices.controller');
const adminNotices = new AdminNotices();
// auth-middleware incomplete stage
// admin-middleware incomplete stage

// create Notice
router.post('/adminNotices', adminNotices.createAdminNotice.bind(adminNotices));

// findAll all_Notice - admin page
router.get('/admin/adminNotices', adminNotices.getAdminNoticeList.bind(adminNotices));

// findAll notice - not deleted
router.get('/adminNotices', adminNotices.getAdminNotices.bind(adminNotices));

// findAll notice - deleted  <- 일단 만들어둠
router.get('/adminNotices/deleted', adminNotices.getDeletedAdminNotices.bind(adminNotices));

// findOne notice - not deleted
router.get('/adminNotices/:id', adminNotices.getAdminNotice.bind(adminNotices));

// update notice
router.put('/adminNotices/:id', adminNotices.updateAdminNotice.bind(adminNotices));

// soft delete notice
router.delete('/adminNotices/:id', adminNotices.deleteAdminNotice.bind(adminNotices));

// hard delete notice
router.delete('/adminNotices/:id/delete', adminNotices.hardDeleteAdminNotice.bind(adminNotices));

module.exports = router;
