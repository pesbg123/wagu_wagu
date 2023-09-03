const AdminUserBanService = require('../services/admin.user.ban.service');

class AdminUserBanController {
  constructor() {
    this.adminUserBanService = new AdminUserBanService();
  }

  // POST admin-user-ban
  async createUserBan(req, res) {
    try {
      const { user_id } = req.params;
      const { banned_reason } = req.body;

      if (!banned_reason) return res.status(400).json({ errorMessage: '밴 사유를 입력해주세요.' });
      const bannedUserInfo = await this.adminUserBanService.createUserBan(user_id, banned_reason);

      return res.status(200).json({ message: '해당 유저를 밴하였습니다.', user: bannedUserInfo });
    } catch (error) {
      console.log(error);
      // 커스텀 에러
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message });
      // 서버에러
      return res.status(500).json({ errorMessage: error.message });
    }
  }

  // GET all-users
  async getAllUsers(req, res) {
    try {
      const allUsers = await this.adminUserBanService.getAllUsers();
      return res.status(200).json(allUsers);
    } catch (error) {
      console.log(error);
      // 커스텀 에러
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message });
      // 서버에러
      return res.status(500).json({ errorMessage: error.message });
    }
  }

  // GET user-ban-history - All
  async getBanHistoryByUser(req, res) {
    try {
      const { user_id } = req.params;

      const getBanHistoryByUser = await this.adminUserBanService.getBanHistoryByUser(user_id);
      return res.status(200).json({ getBanHistoryByUser });
    } catch (error) {
      console.log(error);
      // 커스텀 에러
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message });
      // 서버에러
      return res.status(500).json({ errorMessage: error.message });
    }
  }

  // DELETE admin-user-ban
  async deleteUserBan(req, res) {
    try {
      const { id } = req.params;

      await this.adminUserBanService.deleteUserBan(id);

      return res.status(200).json({ message: '해당 유저 밴을 취소하였습니다.' });
    } catch (error) {
      console.log(error);
      // 커스텀 에러
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message });
      // 서버에러
      return res.status(500).json({ errorMessage: error.message });
    }
  }
}

module.exports = AdminUserBanController;
