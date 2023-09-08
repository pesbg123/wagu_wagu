const { Followers, Users } = require('../models');

class UserFollowRepository {
  async findUserById(id) {
    return await Users.findOne({ where: { id } });
  }

  async addFollower(user_id, target_id) {
    return await Followers.create({ user_id, target_id });
  }

  async findFollower(user_id, target_id) {
    return await Followers.findOne({ where: { user_id, target_id } });
  }

  async removeFollower(user_id, target_id) {
    return await Followers.destroy({ where: { user_id, target_id } });
  }
  async getUserFollowedUsers(user_id) {
    try {
      const targetIds = await Followers.findAll({
        attributes: ['target_id'],
        where: { user_id },
      });
      const followedUsers = await Users.findAll({
        where: { id: targetIds[0].dataValues.target_id },
      });
      return followedUsers;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserFollowRepository;
