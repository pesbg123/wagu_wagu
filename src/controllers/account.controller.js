const AccountService = require('../services/account.service');

class AccountController {
  constructor() {
    this.authService = new AccountService();
  }

  signUp = async (req, res) => {
    try {
      const { email, password } = req.body;

      await this.authService.signUp(email, password);

      return res.status(201).json({ message: '회원가입 성공' });
    } catch (error) {
      if (error.errorCode) {
        console.error('회원가입 오류:', error);
        return res.status(error.errorCode).json({ message: error.message });
      }
      console.error('회원가입 오류:', error);
      res.status(500).json({ message: '서버 오류' });
    }
  };

  logIn = async (req, res) => {
    try {
      const { email, password } = req.body;

      const tokens = await this.authService.logIn(email, password);

      const isAdmin = await tokens.isAdmin;

      console.log('🚀 ~ file: account.controller.js:33 ~ AccountController ~ logIn= ~ isAdmin:', isAdmin);

      if (isAdmin === true) {
        return res.setHeader('Authorization', `Bearer ${tokens.accessToken}`).json({ admin: 'true' });
      } else {
        return res.setHeader('Authorization', `Bearer ${tokens.accessToken}`).json({ admin: 'false' });
      }
    } catch (error) {
      if (error.errorCode) {
        console.error('로그인 오류:', error);
        return res.status(error.errorCode).json({ message: error.message });
      }
      console.error('로그인 오류:', error);
      res.status(500).json({ message: error.message });
    }
  };

  logOut = async (req, res) => {
    try {
      const header = req.headers.cookie;
      let accessToken;
      if (header) {
        const tokenParts = header.split(' ');
        if (tokenParts.length === 2 && tokenParts[0] === 'Authorization=Bearer') {
          accessToken = tokenParts[1];
        }
      }

      await this.authService.logOut(accessToken);
      console.log(1231234);
      res.clearCookie('Authorization');
      return res.status(200).json({ message: '로그아웃 성공' });
    } catch (error) {
      if (error.errorCode) {
        console.error('로그아웃 오류:', error);
        return res.status(error.errorCode).json({ message: error.message });
      }
      console.error('로그아웃 오류:', error);
      res.status(500).json({ message: error.message });
    }
  };

  verify = async (req, res) => {
    try {
      const header = req.headers.cookie;
      let accessToken;
      if (header) {
        const tokenParts = header.split(' ');
        if (tokenParts.length === 2 && tokenParts[0] === 'Authorization=Bearer') {
          accessToken = tokenParts[1];
        }
      }
      return res.status(200).json({ message: '검증 성공' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
}

module.exports = AccountController;
