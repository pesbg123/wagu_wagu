const AdminNoticesRepository = require('../repositories/admin.notices.repository');
const CustomError = require('../errors/customError');

class AdminNoticesService {
  constructor() {
    this.adminNoticesRepository = new AdminNoticesRepository();
  }

  // POST admin-notice
  async createAdminNotice(user_id, content) {
    const newAdminNotice = await this.adminNoticesRepository.createAdminNotice(user_id, content);
    if (newAdminNotice) {
      return newAdminNotice;
    } else {
      throw new Error('공지 작성에 실패했습니다.');
    }
  }

  // GET admin-notices ALL - not deleted
  async getAdminNotices() {
    const adminNoticeList = await this.adminNoticesRepository.getAdminNotices();
    if (!adminNoticeList.length) throw new CustomError('작성된 공지를 찾을 수 없습니다.', 404);
    return adminNoticeList;
  }

  // GET admin-notices ALL - deleted
  async getDeletedAdminNotices() {
    const deletedAdminNoticeList = await this.adminNoticesRepository.getDeletedAdminNotices();
    if (!deletedAdminNoticeList.length) throw new CustomError('삭제된 공지를 찾을 수 없습니다.', 404);
    return deletedAdminNoticeList;
  }

  // GET admin-notice One - not deleted
  async getAdminNotice(id) {
    const adminNotice = await this.adminNoticesRepository.getAdminNotice(id);
    if (!adminNotice) throw new CustomError('해당 공지를 찾을 수 없습니다.', 404);
    return adminNotice;
  }

  // PATCH admin-notice
  async updateAdminNotice(id, content) {
    const existAdminNotice = await this.adminNoticesRepository.getAdminNotice(id);
    if (!existAdminNotice) {
      throw new CustomError('해당 공지를 찾을 수 없습니다.', 404);
    }

    const newUpdateAdminNotice = await this.adminNoticesRepository.updateAdminNotice(id, content);

    if (newUpdateAdminNotice) {
      return;
    } else {
      throw new Error('공지 수정에 실패했습니다.');
    }
  }

  // DELETE admin-notice
  async deleteAdminNotice(id) {
    const existAdminNotice = await this.adminNoticesRepository.getAdminNotice(id);
    if (!existAdminNotice) {
      throw new CustomError('해당 공지를 찾을 수 없습니다.', 404);
    }

    const res = await this.adminNoticesRepository.deleteAdminNotice(id);

    if (res) {
      return;
    } else {
      throw new Error('공지 삭제에 실패했습니다.');
    }
  }
}

module.exports = AdminNoticesService;
