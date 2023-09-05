const UserFollowService = require('../services/userFollow.service');

class UserFollowController {
  constructor() {
    this.userFollowService = new UserFollowService();
  }

  async addUserFollow(req, res) {
    try {
      const { id: user_id } = req.user;
      const { target_id } = req.body;

      await this.userFollowService.addUserFollow(user_id, target_id);

      return res.status(200).json({ message: ' 팔로워 등록에 성공했습니다! ' });
    } catch (error) {
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message });
      console.error(error);
      return res.status(500).json({ errorMessage: '팔로워 등록에 실패했습니다.' });
    }
  }

  async removeUserFollow(req, res) {
    try {
      const { id: user_id } = req.user;
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
