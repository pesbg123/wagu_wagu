const express = require('express');
const router = express.Router();

const AccountController = require('../controllers/account.controller.js');
const accountController = new AccountController();
const Accountmiddleware = require('../middlewares/account.middleware.js');
const accountmiddleware = new Accountmiddleware();

router.post('/signup', accountController.signUp);
router.post('/login', accountController.logIn);
router.post('/logout', accountController.logOut);
router.get('/verify', accountmiddleware.authenticateAccessToken, accountController.verify);
router.get('/admin/verify', accountmiddleware.isAdmin, accountmiddleware.authenticateAccessToken, accountController.verify);
router.get('/profile', accountmiddleware.authenticateAccessToken, accountController.getProfile);
router.patch('/profile/nickname', accountmiddleware.authenticateAccessToken, accountController.updateNickname);
router.patch('/profile/introduction', accountmiddleware.authenticateAccessToken, accountController.updateIntroduction);
router.patch('/profile/userimg', accountmiddleware.authenticateAccessToken, accountController.updateUserImg);
router.patch('/profile/password', accountmiddleware.authenticateAccessToken, accountController.updatePassword);
router.get('/dashboard', accountmiddleware.isAdmin, accountmiddleware.authenticateAccessToken, accountController.getDashBoard);

module.exports = router;
