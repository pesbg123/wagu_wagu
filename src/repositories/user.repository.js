const { Users } = require('../models');

class UsersRepository {
  async getUser(id) {
    return await Users.findOne({
      where: { id },
      attributes: ['id', 'user_img', 'nickname', 'email'],
    });
  }
}

module.exports = UsersRepository;
