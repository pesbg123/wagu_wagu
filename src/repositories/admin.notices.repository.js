const { AdminNotices } = require('../models');
const { Op } = require('sequelize');

class AdminNoticesRepository {
  // POST admin-notice
  async createAdminNotice(user_id, content) {
    return await AdminNotices.create({ user_id, content });
  }

  // ADMIN GET admin-page All notices
  async getAdminNoticeList() {
    return await AdminNotices.findAll({ raw: true, paranoid: false, order: [['created_at', 'DESC']] });
  }

  // GET admin-notices ALL - not deleted
  async getAdminNotices() {
    return await AdminNotices.findAll({ raw: true, order: [['created_at', 'DESC']] });
  }

  // GET admin-notices ALL - deleted
  async getDeletedAdminNotices() {
    return await AdminNotices.findAll({ raw: true, paranoid: false, where: { deleted_at: { [Op.not]: null } }, order: [['created_at', 'DESC']] });
  }

  // GET admin-notice One - not deleted
  async getAdminNotice(id) {
    return await AdminNotices.findOne({ raw: true, where: { id }, order: [['created_at', 'DESC']] });
  }

  // GET admin-notice One - deleted
  async getDeletedAdminNotice(id) {
    return await AdminNotices.findOne({ raw: true, paranoid: false, where: { id, deleted_at: { [Op.not]: null } }, order: [['created_at', 'DESC']] });
  }

  // PATCH admin-notice
  async updateAdminNotice(id, content) {
    return await AdminNotices.update({ content }, { where: { id } });
  }

  // DELETE admin-notice - soft delete
  async deleteAdminNotice(id) {
    return await AdminNotices.destroy({ where: { id } });
  }

  // ADMIN DELETE admin-notice - hard delete
  async hardDeleteAdminNotice(id) {
    return await AdminNotices.destroy({ where: { id }, force: true });
  }
}

module.exports = AdminNoticesRepository;
