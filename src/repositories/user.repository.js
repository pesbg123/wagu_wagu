const { Users } = require('../models');

class UsersRepository {
  async findById(id) {
    return await Users.findByPk(id);
  }
}

module.exports = UsersRepository;
