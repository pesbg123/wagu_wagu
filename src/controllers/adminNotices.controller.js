const AdminNoticesService = require('../services/adminNotices.service');

const user_id = 1; // temporary hardcoding

class AdminNoticesController {
  constructor() {
    this.adminNoticesService = new AdminNoticesService();
  }

  // POST admin-notice
  async createAdminNotice(req, res) {
    try {
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ errorMessage: '공지 내용을 입력해주세요.' });
      }

      const response = await this.adminNoticesService.createAdminNotice(user_id, content);
      return res.status(200).json({ message: '공지 작성에 성공했습니다.', response });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errorMessage: error.message });
    }
  }

  // GET admin-notice
  async getAdminNotices(req, res) {
    try {
      const noticeList = await this.adminNoticesService.getAdminNotices(user_id);
      return res.status(200).json(noticeList);
    } catch (error) {
      console.log(error);
      // 작성된 공지가 없을 경우
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message, data: [] });
      res.status(500).json({ errorMessage: '공지 목록 조회에 실패했습니다.' });
    }
  }
}

module.exports = AdminNoticesController;
