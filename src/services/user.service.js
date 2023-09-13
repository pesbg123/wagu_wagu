const CustomError = require('../errors/customError');
const UserRepository = require('../repositories/user.repository');

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUser(user_id) {
    try {
      const user = await this.userRepository.getUser(user_id);
      if (!user) throw new CustomError('해당 사용자가 존재하지 않습니다.', 404);
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = UserService;
