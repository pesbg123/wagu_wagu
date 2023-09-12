const { Users, Followers } = require('../models');

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

  async getUserFollowedUsers(user_Id) {
    try {
      const targets = await Followers.findAll({
        attributes: ['target_Id'],
        where: { user_Id },
      });

      if (!targets.length) return [];

      const followedUsers = await Users.findAll({
        where: { id: targets.map((target) => target.dataValues.target_Id) },
      });

      return followedUsers;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserFollowRepository;
