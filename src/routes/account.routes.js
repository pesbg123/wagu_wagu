const express = require('express');
const router = express.Router();

const AccountController = require('../controllers/account.controller.js');
const accountController = new AccountController();

router.post('/signup', accountController.signUp);
router.post('/login', accountController.logIn);
router.post('/logout', accountController.logOut);

module.exports = router;
