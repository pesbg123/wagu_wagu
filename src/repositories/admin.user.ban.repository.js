const { BannedUsers, Users } = require('../models');
const { Op } = require('sequelize');

class AdminUserBanRepository {
  // POST admin-user-ban
  async createBanUser(user_id, banned_reason) {
    return await BannedUsers.create({ user_id, banned_reason });
  }

  // GET all-users
  async getAllUsers() {
    return await Users.findAll({
      raw: true,
      paranoid: false,
      attributes: ['id', 'nickname', 'email', 'deleted_at', 'created_at'],
      include: [
        {
          model: BannedUsers,
          attributes: ['banned_reason', 'id', 'created_at', 'deleted_at'],
        },
      ],
    });
  }

  // GET admin-user-ban-info - One
  async getBannedUser(id) {
    return await BannedUsers.findOne({ raw: true, where: { id } });
  }

  // GET admin-user-ban-info - All
  async getBanHistoryByUser(user_id) {
    return await BannedUsers.findAll({ raw: true, paranoid: false, where: { user_id } });
  }

  // DELETE admin-user-ban
  async deleteBanUser(id) {
    return await BannedUsers.destroy({ where: { id } });
  }

  // GET search-user
  async searchUsers(nickname) {
    const searchUser = await Users.findAll({
      paranoid: false,
      where: {
        nickname: {
          [Op.like]: `%${nickname}%`,
        },
      },
      attributes: ['id', 'email', 'nickname', 'created_at', 'deleted_at'],
    });
    return searchUser;
  }
}

module.exports = AdminUserBanRepository;
