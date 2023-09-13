const express = require('express');
const UsersController = require('../controllers/user.controller');
const router = express.Router();
const usersController = new UsersController();

const AuthMiddleware = require('../middlewares/account.middleware');
const authMiddleware = new AuthMiddleware();

// 사용자 정보 가져오기
router.get('/user', authMiddleware.authenticateAccessToken, usersController.getUser.bind(usersController));

module.exports = router;
