const AdminNoticesService = require('../services/admin.notices.service');

const user_id = 1; // temporary hardcoding

class AdminNoticesController {
  constructor() {
    this.adminNoticesService = new AdminNoticesService();
  }

  // ADMIN POST admin-notice
  async createAdminNotice(req, res) {
    try {
      const { content } = req.body;
      // const { user_id } = req.user;

      if (!content) {
        return res.status(400).json({ errorMessage: '공지 내용을 입력해주세요.' });
      }

      const newAdminNotice = await this.adminNoticesService.createAdminNotice(user_id, content);
      return res.status(200).json({ message: '공지 등록에 성공했습니다.', newAdminNotice });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errorMessage: error.message });
    }
  }

  // ADMIN GET admin-page All notices
  async getAdminNoticeList(req, res) {
    try {
      const adminNoticeList = await this.adminNoticesService.getAdminNoticeList();
      return res.status(200).json(adminNoticeList);
    } catch (error) {
      console.log(error);
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message, data: [] });
      return res.status(500).json({ errorMessage: '공지 리스트 조회에 실패했습니다.' });
    }
  }

  // USER GET admin-notices ALL - not deleted
  async getAdminNotices(req, res) {
    try {
      const adminNoticeList = await this.adminNoticesService.getAdminNotices();
      return res.status(200).json(adminNoticeList);
    } catch (error) {
      console.log(error);
      // 작성된 공지가 없을 경우
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message, data: [] });
      return res.status(500).json({ errorMessage: '공지 목록 조회에 실패했습니다.' });
    }
  }

  // ADMIN GET admin-notices ALL - deleted
  async getDeletedAdminNotices(req, res) {
    try {
      const deletedAdminNoticeList = await this.adminNoticesService.getDeletedAdminNotices();
      return res.status(200).json(deletedAdminNoticeList);
    } catch (error) {
      console.log(error);
      // 삭제된 공지가 없을 경우
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message, data: [] });
      return res.status(500).json({ errorMessage: '삭제된 공지 목록 조회에 실패 했습니다.' });
    }
  }

  // GET admin-notice One - not deleted
  async getAdminNotice(req, res) {
    try {
      const { id } = req.params;

      const adminNotice = await this.adminNoticesService.getAdminNotice(id);
      return res.status(200).json(adminNotice);
    } catch (error) {
      console.log(error);
      // 공지가 존재하지 않는 경우
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message, data: [] });
      return res.status(500).json({ errorMessage: '삭제된 공지 조회에 실패했습니다.' });
    }
  }

  // ADMIN PATCH admin-notice
  async updateAdminNotice(req, res) {
    try {
      const { content } = req.body;
      const { id } = req.params;
      if (!content) {
        return res.status(400).json({ errorMessage: '공지 내용을 입력해주세요.' });
      }
      await this.adminNoticesService.updateAdminNotice(id, content);

      return res.status(200).json({ message: '공지 수정에 성공했습니다.' });
    } catch (error) {
      console.log(error);
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message });
      return res.status(500).json({ errorMessage: error.message });
    }
  }

  // ADMIN DELETE admin-notice - soft delete
  async deleteAdminNotice(req, res) {
    try {
      const { id } = req.params;
      await this.adminNoticesService.deleteAdminNotice(id);
      return res.status(200).json({ message: '공지 삭제에 성공했습니다.' });
    } catch (error) {
      console.log(error);
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message });
      return res.status(500).json({ errorMessage: error.message });
    }
  }

  // ADMIN DELETE admin-notice - hard delete
  async hardDeleteAdminNotice(req, res) {
    try {
      const { id } = req.params;
      await this.adminNoticesService.hardDeleteAdminNotice(id);
      return res.status(200).json({ message: '공지 영구삭제에 성공했습니다.' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errorMessage: error.message });
    }
  }
}

module.exports = AdminNoticesController;
