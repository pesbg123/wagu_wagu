const { Followers } = require('../models');

class UserFollowRepository {
  async findUserById(user_id) {
    return await Followers.findByPk(user_id);
  }

  async addUserFollow(user_id, target_id) {
    const user = await this.findUserById(user_id);
    if (!user) {
      throw new Error('유저를 찾을 수 없습니다.');
    }
  }

  async addFollower(user_id, target_id) {
    return await Followers.create({ user_id, target_id });
  }

  async removeFollower(user, targetUser) {
    await user.removeFollowing(targetUser);
  }
}

module.exports = UserFollowRepository;
