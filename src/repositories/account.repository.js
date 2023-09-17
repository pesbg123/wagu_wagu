const { Users, VisitorLogs, Posts, Hashtags, PostHashtags } = require('../models');
const { Op } = require('sequelize');

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

  getDashBoard = async () => {
    try {
      const nonDeletedUsers = await Users.count({ where: { deleted_at: null } });

      const today = new Date();
      const oneMonthAgo = new Date(today);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const startOfYesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 0, 0, 0);
      const endOfYesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 23, 59, 59);

      const usersCreatedLastMonth = await Users.count({
        where: {
          created_at: {
            [Op.gte]: oneMonthAgo,
            [Op.lte]: today,
          },
        },
      });

      const usersCreatedLastWeek = await Users.count({
        where: {
          created_at: {
            [Op.gte]: oneWeekAgo,
            [Op.lte]: today,
          },
        },
      });

      const usersCreatedToday = await Users.count({
        where: {
          created_at: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay,
          },
        },
      });

      const visitorsLastWeek = await VisitorLogs.count({
        where: {
          createdAt: {
            [Op.gte]: oneWeekAgo,
            [Op.lte]: today,
          },
          contents: '로그인',
        },
      });

      const visitorsThisMonth = await VisitorLogs.count({
        where: {
          createdAt: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfMonth,
          },
          contents: '로그인',
        },
      });

      const visitorsYesterday = await VisitorLogs.count({
        where: {
          createdAt: {
            [Op.gte]: startOfYesterday,
            [Op.lte]: endOfYesterday,
          },
          contents: '로그인',
        },
      });

      const visitorsToday = await VisitorLogs.count({
        where: {
          createdAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay,
          },
        },
      });

      const postsCreatedThisMonth = await Posts.count({
        where: {
          created_at: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfMonth,
          },
        },
      });

      const postsCreatedThisWeek = await Posts.count({
        where: {
          created_at: {
            [Op.gte]: oneWeekAgo,
            [Op.lte]: today,
          },
        },
      });

      const postsCreatedYesterday = await Posts.count({
        where: {
          created_at: {
            [Op.gte]: startOfYesterday,
            [Op.lte]: endOfYesterday,
          },
        },
      });

      const postsCreatedToday = await Posts.count({
        where: {
          created_at: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay,
          },
        },
      });

      const allHashtags = await Hashtags.findAll();

      const hashtagCounts = {};
      for (const hashtag of allHashtags) {
        const hashtagId = hashtag.id;

        const postCount = await PostHashtags.count({
          where: {
            hashtag_id: hashtagId,
          },
        });

        hashtagCounts[hashtag.hashtag] = postCount;
      }

      const data = {
        usersCreatedLastMonth,
        usersCreatedLastWeek,
        usersCreatedToday,
        visitorsThisMonth,
        visitorsLastWeek,
        visitorsYesterday,
        visitorsToday,
        postsCreatedThisMonth,
        postsCreatedThisWeek,
        postsCreatedYesterday,
        postsCreatedToday,
        hashtagCounts,
      };
      console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  saveLoginLog = async (id) => {
    try {
      const str = '로그인';
      const loginLog = await VisitorLogs.create({ userId: id, contents: str });
      return;
    } catch (error) {
      throw error;
    }
  };

  saveLogoutLog = async (id) => {
    try {
      const str = '로그아웃';
      const logoutLog = await VisitorLogs.create({ userId: id, contents: str });
      return;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = AccountRepository;
