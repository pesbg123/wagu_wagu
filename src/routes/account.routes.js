const express = require('express');
const router = express.Router();

const AccountController = require('../controllers/account.controller.js');
const accountController = new AccountController();
const Accountmiddleware = require('../middlewares/account.middleware.js');
const accountmiddleware = new Accountmiddleware();

router.post('/signup', accountController.signUp);
router.post('/login', accountController.logIn);
router.post('/logout', accountmiddleware.authenticateAccessToken, accountController.logOut);
router.get('/verify', accountmiddleware.authenticateAccessToken, accountController.verify);
router.get('/admin/verify', accountmiddleware.isAdmin, accountmiddleware.authenticateAccessToken, accountController.verify);

module.exports = router;
