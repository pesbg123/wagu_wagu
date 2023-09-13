const UserService = require('../services/user.service');

class UserController {
  constructor() {
    this.userService = new UserService();
  }
  // 유저 정보 가져오기.
  async getUser(req, res) {
    try {
      const { id: user_id } = req.user;
      const user = await this.userService.getUser(user_id);
      return res.status(200).json(user);
    } catch (error) {
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message });
      console.error(error);
      return res.status(500).json({ errorMessage: '사용자 권한 인증에 실패했습니다.' });
    }
  }
}
module.exports = UserController;
