const CustomError = require('../errors/customError');
const AdminUserBanRepository = require('../repositories/admin.user.ban.repository');

class AdminUserBanService {
  constructor() {
    this.adminUserBanRepository = new AdminUserBanRepository();
  }

  // POST admin-user-ban
  async createUserBan(user_id, banned_reason) {
    const existBanUser = await this.adminUserBanRepository.getBannedUser(user_id);
    if (existBanUser) throw new CustomError('이미 밴 한 유저입니다.', 400);

    const res = await this.adminUserBanRepository.createBanUser(user_id, banned_reason);

    if (!res) throw new Error('해당 유저를 밴하는 과정에서 오류가 발생했습니다.');
    return res;
  }

  // GET all-users
  async getAllUsers() {
    const allUsers = await this.adminUserBanRepository.getAllUsers();
    return allUsers.length ? allUsers : [];
  }

  // GET user-ban-history - All
  async getBanHistoryByUser(user_id) {
    const res = await this.adminUserBanRepository.getBanHistoryByUser(user_id);

    if (!res) throw new Error('해당 유저의 밴 데이터를 조회하는 과정에서 오류가 발생했습니다.');
    return res;
  }

  // DELETE admin-user-ban
  async deleteUserBan(id) {
    const existBanUser = await this.adminUserBanRepository.getBannedUser(id);
    if (!existBanUser) throw new CustomError('밴 당하지 않은 유저입니다.', 400);

    const res = await this.adminUserBanRepository.deleteBanUser(id);

    if (!res) throw new Error('해당 유저를 밴 취소하는 과정에서 오류가 발생했습니다.');
    return;
  }
}
module.exports = AdminUserBanService;
