const express = require('express');
const router = express.Router();
const AdminUserBanController = require('../controllers/admin.user.ban.controller');
const adminUserBanController = new AdminUserBanController();

router.post('/bannedUsers', adminUserBanController.createUserBan.bind(adminUserBanController));

router.get('/bannedUsers/:user_id/history', adminUserBanController.getBanHistoryByUser.bind(adminUserBanController));

router.delete('/bannedUsers/:user_id', adminUserBanController.deleteUserBan.bind(adminUserBanController));

module.exports = router;
