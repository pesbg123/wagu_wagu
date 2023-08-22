const AdminNoticesRepository = require('../repositories/adminNotices.repository');

class AdminNoticesService {
  constructor() {
    this.adminNoticesRepository = new AdminNoticesRepository();
  }

  // create admin-notice
  async createAdminNotice(user_id, content) {
    const response = await this.adminNoticesRepository.createAdminNotice(user_id, content);
    if (response) {
      return response;
    }
    throw '공지 작성에 오류가 발생했습니다.';
  }
}

module.exports = AdminNoticesService;
