const { Users } = require('../models');

class AccountRepository {
  createUser = async (email, password) => {
    const user = await Users.create({ email, password });

    return user;
  };

  findUserByEmail = async (email) => {
    const user = await Users.findOne({
      where: { email },
    });

    return user;
  };

  findUserByUserId = async (userId) => {
    const user = await Users.findOne({
      where: { id: userId },
    });

    return user;
  };

  // updateUserLoginId = async (userId, newLoginId) => {
  //   await Users.update({ email: newLoginId }, { where: { id: userId } });
  // };

  // updateUserPassword = async (userId, newPassword) => {
  //   await Users.update({ password: newPassword }, { where: { id: userId } });
  // };

  // updateUserUserName = async (userId, newUserName) => {
  //   await Users.update({ userName: newUserName }, { where: { id: userId } });
  // };
}

module.exports = AccountRepository;
