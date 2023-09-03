const { BannedUsers, Users } = require('../models');

class AdminUserBanRepository {
  // POST admin-user-ban
  async createBanUser(user_id, banned_reason) {
    return await BannedUsers.create({ user_id, banned_reason });
  }

  // GET all-users
  async getAllUsers() {
    return await Users.findAll({
      paranoid: false,
      raw: true,
      attributes: ['id', 'nickname', 'email', 'deleted_at', 'created_at'],
      include: [
        {
          model: BannedUsers,
          attributes: ['banned_reason', 'id', 'created_at', 'deleted_at'],
        },
      ],
    });
  }

  // GET all-banned-users
  // async getAllBannedUsers() {
  //   return await BannedUsers.findAll({
  //     raw: true,
  //     attributes: ['id', 'user_id', 'banned_reason', 'created_at'],
  //     include: [
  //       {
  //         model: Users,
  //         where: { id: Sequelize.col('BannedUsers.user_id') },
  //         attributes: ['id', 'nickname', 'email'],
  //       },
  //     ],
  //   });
  // }

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
}

module.exports = AdminUserBanRepository;
