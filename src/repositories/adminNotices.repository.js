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

  // GET findOne admin-notices
  async getAdminNotice(id) {
    return await AdminNotices.findOne({ raw: true, where: { id }, order: [['created_at', 'DESC']] });
  }

  // PATCH admin-notice
  async updateAdminNotice(id, content) {
    return await AdminNotices.update({ content }, { where: { id } });
  }
}

module.exports = AdminNoticesRepository;
