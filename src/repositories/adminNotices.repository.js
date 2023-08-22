const { AdminNotices } = require('../models');

class AdminNoticesRepository {
  // POST admin-notice
  async createAdminNotice(user_id, content) {
    return await AdminNotices.create({ user_id, content });
  }

  // GET findAll admin-notices
  async getAdminNotices(user_id) {
    return await AdminNotices.findAll({ where: { user_id } });
  }
}

module.exports = AdminNoticesRepository;
