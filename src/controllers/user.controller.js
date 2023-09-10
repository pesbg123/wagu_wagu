const UsersService = require('../services/user.service');

class UsersController {
  constructor() {
    this.usersService = new UsersService();
  }
  // GET user - One
  async getUser(req, res) {
    try {
      const hardCodedUserId = 1; // 하드 코딩된 사용자 ID
      const user = await this.usersService.getUser(hardCodedUserId);

      if (!user) {
        return res.status(404).json({ errorMessage: '해당 ID의 사용자가 존재하지 않습니다.' });
      }

      let userInfo = user.get({ plain: true });
      delete userInfo.password;

      return res.status(200).json(userInfo);
    } catch (error) {
      console.error(error);

      if (error.message === '해당 ID의 사용자가 존재하지 않습니다.') {
        return res.status(404).json({ errorMessage: error.message });
      }

      return res.status(500).json({ errorMessage: '사용자 조회에 실패했습니다.' });
    }
  }
}
module.exports = UsersController;
