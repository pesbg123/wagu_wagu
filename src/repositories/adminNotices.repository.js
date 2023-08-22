const { AdminNotices } = require('../models');
const { Op } = require('sequelize');

class AdminNoticesRepository {
  // POST admin-notice
  async createAdminNotice(user_id, content) {
    return await AdminNotices.create({ user_id, content });
  }

  // GET admin-notices ALL - not deleted
  async getAdminNotices() {
    return await AdminNotices.findAll({ order: [['created_at', 'DESC']] });
  }

  // GET admin-notices ALL - deleted
  async getDeletedAdminNotices() {
    return await AdminNotices.findAll({ paranoid: false, where: { deleted_at: { [Op.not]: null } }, order: [['created_at', 'DESC']] });
  }

  // GET admin-notice One - not deleted
  async getAdminNotice(id) {
    return await AdminNotices.findOne({ raw: true, where: { id }, order: [['created_at', 'DESC']] });
  }

  // PATCH admin-notice
  async updateAdminNotice(id, content) {
    return await AdminNotices.update({ content }, { where: { id } });
  }

  // DELETE admin-notice
  async deleteAdminNotice(id) {
    return await AdminNotices.destroy({ where: { id } });
  }
}

module.exports = AdminNoticesRepository;
