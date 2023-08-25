const { where } = require('sequelize');
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
}

module.exports = UserFollowRepository;
