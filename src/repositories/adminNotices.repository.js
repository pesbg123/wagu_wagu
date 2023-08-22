const { AdminNotices } = require('../models');

class AdminNoticesRepository {
  // create admin-notice
  async createAdminNotice(user_id, content) {
    return await AdminNotices.create({ user_id, content });
  }
}

module.exports = AdminNoticesRepository;
