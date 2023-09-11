const AccountService = require('../services/account.service');
const { uploadUser } = require('../middlewares/uploadMiddleware');

class AccountController {
  constructor() {
    this.accountService = new AccountService();
  }

  signUp = async (req, res) => {
    try {
      const { email, password } = req.body;

      await this.accountService.signUp(email, password);

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

      const tokens = await this.accountService.logIn(email, password);

      const isAdmin = await tokens.isAdmin;

      // console.log('🚀 ~ file: account.controller.js:33 ~ AccountController ~ logIn= ~ isAdmin:', isAdmin);

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
      // const header = req.headers.cookie;
      // let accessToken;
      // if (header) {
      //   const tokenParts = header.split(' ');
      //   if (tokenParts.length === 2 && tokenParts[0] === 'Authorization=Bearer') {
      //     accessToken = tokenParts[1];
      //   }
      // }

      // console.log('🚀 ~ file: account.controller.js:62 ~ AccountController ~ logOut= ~ headers:', req.headers);

      const accessToken = req.headers.authorization;

      // console.log('🚀 ~ file: account.controller.js:63 ~ AccountController ~ logOut= ~ accessToken:', accessToken);

      await this.accountService.logOut(accessToken);

      // res.clearCookie('Authorization');
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
      return res.status(200).json({ message: '검증 성공' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

  getProfile = async (req, res) => {
    try {
      const { id } = req.user;
      const user = await this.accountService.getProfile(id);

      const pickUser = {
        email: user.email,
        nickname: user.nickname,
        introduction: user.introduction,
        user_img: user.user_img,
      };

      return res.status(200).json(pickUser);
    } catch (error) {
      if (error.errorCode) {
        console.error('프로필 불러오기 오류:', error);
        return res.status(error.errorCode).json({ message: error.message });
      }
      console.error('프로필 불러오기 오류:', error);
      res.status(500).json({ message: error.message });
    }
  };

  updateNickname = async (req, res) => {
    try {
      const { id } = req.user;
      const { nickname } = req.body;
      await this.accountService.updateNickname(id, nickname);

      return res.status(200).json({ message: '닉네임 변경 성공' });
    } catch (error) {
      if (error.errorCode) {
        console.error('닉네임 변경 오류:', error);
        return res.status(error.errorCode).json({ message: error.message });
      }
      console.error('닉네임 변경 오류:', error);
      res.status(500).json({ message: error.message });
    }
  };

  updateIntroduction = async (req, res) => {
    try {
      const { id } = req.user;
      const { introduction } = req.body;
      await this.accountService.updateIntroduction(id, introduction);

      return res.status(200).json({ message: '소개 변경 성공' });
    } catch (error) {
      if (error.errorCode) {
        console.error('소개 변경 오류:', error);
        return res.status(error.errorCode).json({ message: error.message });
      }
      console.error('소개 변경 오류:', error);
      res.status(500).json({ message: error.message });
    }
  };

  updateUserImg = async (req, res) => {
    try {
      const { id } = req.user;

      uploadUser.single('userImage')(req, res, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: '이미지 업로드에 실패하였습니다.' });
        }

        const userImage = req.file ? req.file.location : null;

        await this.accountService.updateUserImg(id, userImage);

        return res.status(200).json({ message: '이미지 변경 성공' });
      });
    } catch (error) {
      if (error.errorCode) {
        console.error('이미지 변경 오류:', error);
        return res.status(error.errorCode).json({ message: error.message });
      }
      console.error('이미지 변경 오류:', error);
      res.status(500).json({ message: error.message });
    }
  };

  updatePassword = async (req, res) => {
    try {
      const { id } = req.user;
      const { currentPw, newPw } = req.body;

      await this.accountService.updatePassword(id, currentPw, newPw);

      return res.status(200).json({ message: '비밀번호 변경 성공' });
    } catch (error) {
      if (error.errorCode) {
        console.error('비밀번호 변경 오류:', error);
        return res.status(error.errorCode).json({ message: error.message });
      }
      console.error('비밀번호 변경 오류:', error);
      res.status(500).json({ message: error.message });
    }
  };
}

module.exports = AccountController;
