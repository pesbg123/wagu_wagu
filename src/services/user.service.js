const UsersRepository = require('../repositories/user.repository');

class UsersService {
  constructor() {
    this.usersRepo = new UsersRepository();
  }

  async getUser(id) {
    try {
      const user = await this.usersRepo.findById(id);

      if (!user) throw new Error('해당 ID의 사용자가 존재하지 않습니다.');

      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = UsersService;
