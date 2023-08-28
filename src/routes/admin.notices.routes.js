const express = require('express');
const router = express.Router();
const AdminNotices = require('../controllers/admin.notices.controller');
const adminNotices = new AdminNotices();
// auth-middleware incomplete stage
// admin-middleware incomplete stage

// create Notice
router.post('/adminNotices', adminNotices.createAdminNotice.bind(adminNotices));

// findAll notice - not deleted
router.get('/adminNotices', adminNotices.getAdminNotices.bind(adminNotices));

// findAll notice - deleted
router.get('/adminNotices/deleted', adminNotices.getDeletedAdminNotices.bind(adminNotices));

// findOne notice - not deleted
router.get('/adminNotices/:id', adminNotices.getAdminNotice.bind(adminNotices));

// update notice
router.patch('/adminNotices/:id', adminNotices.updateAdminNotice.bind(adminNotices));

// delete notice
router.delete('/adminNotices/:id', adminNotices.deleteAdminNotice.bind(adminNotices));

module.exports = router;
