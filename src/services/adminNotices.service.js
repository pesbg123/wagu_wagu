const AdminNoticesRepository = require('../repositories/adminNotices.repository');
const CustomError = require('../errors/customError');

class AdminNoticesService {
  constructor() {
    this.adminNoticesRepository = new AdminNoticesRepository();
  }

  // POST admin-notice
  async createAdminNotice(user_id, content) {
    const response = await this.adminNoticesRepository.createAdminNotice(user_id, content);
    if (!response) {
      return response;
    } else {
      throw new Error('공지 작성에 실패했습니다.');
    }
  }

  // GET admin-notice
  async getAdminNotices(user_id) {
    const noticeList = await this.adminNoticesRepository.getAdminNotices(user_id);
    if (!noticeList.length) throw new CustomError('작성된 공지가 없습니다.', 404);
    return noticeList;
  }
}

module.exports = AdminNoticesService;
