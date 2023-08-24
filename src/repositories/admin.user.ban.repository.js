const { BannedUsers } = require('../models');

class AdminUserBanRepository {
  // POST admin-user-ban
  async createBanUser(user_id, banned_reason) {
    return await BannedUsers.create({ user_id, banned_reason });
  }

  // GET admin-user-ban-info - One
  async getBannedUser(user_id) {
    return await BannedUsers.findOne({ raw: true, where: { user_id } });
  }

  // GET admin-user-ban-info - All
  async getBanHistoryByUser(user_id) {
    return await BannedUsers.findAll({ raw: true, paranoid: false, where: { user_id } });
  }

  // DELETE admin-user-ban
  async deleteBanUser(user_id) {
    return await BannedUsers.destroy({ where: { user_id } });
  }
}

module.exports = AdminUserBanRepository;
