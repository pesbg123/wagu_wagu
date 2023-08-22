const AdminNoticesService = require('../services/adminNotices.service');

class AdminNoticesController {
  constructor() {
    this.adminNoticesService = new AdminNoticesService();
  }

  // admin 공지 생성
  async createAdminNotice(req, res) {
    console.log(req);

    const user_id = 1; // temporary hardcoding
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ errorMessage: '공지 내용을 입력해주세요.' });
    }

    const response = await this.adminNoticesService.createAdminNotice(user_id, content);
  }

  // admin 공지 조회

  // admin 공지 삭제

  // admin 공지 수정
}

module.exports = AdminNoticesController;
