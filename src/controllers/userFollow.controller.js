const UserFollowService = require('../services/userFollow.service');

const user_id = 1; // 하드 코딩

class UserFollowController {
  constructor() {
    this.userFollowService = new UserFollowService();
  }

  async addUserFollow(req, res) {
    try {
      // const { user_id } = res.locals.user;
      const { user_id } = req.params;
      const { target_id } = req.body;
      console.log(target_id);
      console.log(user_id);

      const message = await this.userFollowService.addUserFollow(user_id, target_id);

      return res.status(200).json({ message });
    } catch (error) {
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message });
      console.error(error);
      return res.status(500).json({ errorMessage: '팔로워 등록에 실패했습니다.' });
    }
  }

  async removeUserFollow(req, res) {
    try {
      // const { user_id } = res.locals.user;
      const { target_id } = req.body;

      const message = await this.userFollowService.removeUserFollow(user_id, target_id);

      return res.status(200).json({ message });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errorMessage: error.message });
    }
  }
}

module.exports = UserFollowController;
