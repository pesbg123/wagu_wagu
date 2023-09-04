const express = require('express');
const router = express.Router();
const AdminUserBanController = require('../controllers/admin.user.ban.controller');
const adminUserBanController = new AdminUserBanController();

const AcountMiddleware = require('../middlewares/account.middleware');
const acountMiddleware = new AcountMiddleware();

router.post(
  '/bannedUsers/:user_id',
  acountMiddleware.isAdmin,
  acountMiddleware.authenticateAccessToken,
  adminUserBanController.createUserBan.bind(adminUserBanController),
);

router.get(
  '/users/search',
  acountMiddleware.isAdmin,
  acountMiddleware.authenticateAccessToken,
  adminUserBanController.searchUsers.bind(adminUserBanController),
);

router.get(
  '/users',
  acountMiddleware.isAdmin,
  acountMiddleware.authenticateAccessToken,
  adminUserBanController.getAllUsers.bind(adminUserBanController),
);

// router.get('/bannedUsers', adminUserBanController.getAllBannedUsers.bind(adminUserBanController));

router.get(
  '/bannedUsers/:user_id',
  acountMiddleware.isAdmin,
  acountMiddleware.authenticateAccessToken,
  adminUserBanController.getBanHistoryByUser.bind(adminUserBanController),
);

router.delete(
  '/bannedUsers/:id',
  acountMiddleware.isAdmin,
  acountMiddleware.authenticateAccessToken,
  adminUserBanController.deleteUserBan.bind(adminUserBanController),
);

module.exports = router;
