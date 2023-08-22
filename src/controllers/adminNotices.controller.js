const AdminNoticesService = require('../services/adminNotices.service');

class AdminNoticesController {
  constructor() {
    this.adminNoticesService = new AdminNoticesService();
  }

  // create admin-notice
  async createAdminNotice(req, res) {
    try {
      const user_id = 1; // temporary hardcoding
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ errorMessage: '공지 내용을 입력해주세요.' });
      }

      const response = await this.adminNoticesService.createAdminNotice(user_id, content);
      return res.status(200).json({ message: '공지 작성에 성공했습니다.', response });
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = AdminNoticesController;
