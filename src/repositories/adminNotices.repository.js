const { AdminNotices } = require('../models');

class AdminNoticesRepository {
  // POST admin-notice
  async createAdminNotice(user_id, content) {
    return await AdminNotices.create({ user_id, content });
  }

  // GET findAll admin-notices
  async getAdminNotices() {
    return await AdminNotices.findAll({ order: [['created_at', 'DESC']] });
  }
}

module.exports = AdminNoticesRepository;
