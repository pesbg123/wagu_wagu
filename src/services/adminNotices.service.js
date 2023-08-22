const AdminNoticesRepository = require('../repositories/adminNotices.repository');
const CustomError = require('../errors/customError');

class AdminNoticesService {
  constructor() {
    this.adminNoticesRepository = new AdminNoticesRepository();
  }

  // POST admin-notice
  async createAdminNotice(user_id, content) {
    const newAdminNotice = await this.adminNoticesRepository.createAdminNotice(user_id, content);
    if (!newAdminNotice) {
      return newAdminNotice;
    } else {
      throw new Error('공지 작성에 실패했습니다.');
    }
  }

  // GET admin-notice
  async getAdminNotices() {
    const adminNoticeList = await this.adminNoticesRepository.getAdminNotices();
    if (!adminNoticeList.length) throw new CustomError('작성된 공지를 찾을 수 없습니다.', 404);
    return adminNoticeList;
  }

  // GET admin-notice
  async getAdminNotice(id) {
    const noticeList = await this.adminNoticesRepository.getAdminNotice(id);
    if (noticeList.length) throw new CustomError('해당 공지를 찾을 수 없습니다.', 404);
    return noticeList;
  }

  // PATCH admin-notice
  async updateAdminNotice(id, content) {
    const existAdminNotice = await this.adminNoticesRepository.getAdminNotice(id);
    if (!existAdminNotice) {
      throw new CustomError('해당 공지를 찾을 수 없습니다.', 404);
    }

    const newUpdateAdminNotice = await this.adminNoticesRepository.updateAdminNotice(id, content);

    if (newUpdateAdminNotice) {
      return newUpdateAdminNotice;
    } else {
      throw new Error('공지 수정에 실패했습니다.');
    }
  }
}

module.exports = AdminNoticesService;
