const AccountService = require('../services/account.service');

class AccountController {
  constructor() {
    this.authService = new AccountService();
  }

  signUp = async (req, res) => {
    try {
      const { email, password, userName } = req.body;

      await this.authService.signUp(email, password, userName);

      return res.status(201).json({ message: '회원가입 성공' });
    } catch (error) {
      if (error.errorCode) {
        return res.status(error.errorCode).json({ message: error.message });
      }
      res.status(500).json({ message: '서버 오류' });
    }
  };

  logIn = async (req, res) => {
    try {
      const { email, password } = req.body;

      const tokens = await this.authService.logIn(email, password);

      res.setHeader('Authorization', `Bearer ${tokens.accessToken}`);

      return res.status(200).json({ message: '로그인 성공' });
    } catch (error) {
      if (error.errorCode) {
        return res.status(error.errorCode).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  };

  logOut = async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      let accessToken;

      if (authHeader) {
        const tokenParts = authHeader.split(' ');
        if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
          accessToken = tokenParts[1];
        }
      }

      await this.authService.logOut(accessToken);

      res.setHeader('Authorization', '');
      return res.status(200).json({ message: '로그아웃 성공' });
    } catch (error) {
      if (error.errorCode) {
        return res.status(error.errorCode).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  };
}

module.exports = AccountController;
