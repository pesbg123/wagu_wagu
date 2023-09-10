const express = require('express');
const UsersController = require('../controllers/user.controller');
const router = express.Router();
const usersController = new UsersController();

// 사용자 정보 가져오기
router.get('/users/:id', (req, res) => usersController.getUser(req, res));

module.exports = router;
