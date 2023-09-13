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

  findUserByNickname = async (nickname) => {
    const user = await Users.findOne({ where: { nickname } });

    return user;
  };

  isAdmin = async (userId) => {
    const user = await Users.findOne({
      where: { id: userId },
    });

    if (user.is_admin === true) {
      return true;
    } else {
      return false;
    }
  };

  updateNickname = async (id, nickname) => {
    try {
      await Users.update({ nickname }, { where: { id } });
      return;
    } catch (error) {
      throw error;
    }
  };

  updateIntroduction = async (id, introduction) => {
    try {
      await Users.update({ introduction }, { where: { id } });
      return;
    } catch (error) {
      throw error;
    }
  };

  updateUserImg = async (id, userImage) => {
    try {
      await Users.update({ user_img: userImage }, { where: { id } });
      return;
    } catch (error) {
      throw error;
    }
  };

  updatePassword = async (id, hashedPassword) => {
    try {
      await Users.update({ password: hashedPassword }, { where: { id } });
      return;
    } catch (error) {
      throw error;
    }
  };
  // updateUserLoginId = async (userId, newLoginId) => {
  //   await Users.update({ email: newLoginId }, { where: { id: userId } });
  // };

  // updateUserPassword = async (userId, newPassword) => {
  //   await Users.update({ password: newPassword }, { where: { id: userId } });
  // };
}

module.exports = AccountRepository;
