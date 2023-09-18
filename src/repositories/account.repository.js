const { Users, VisitorLogs, Posts, Hashtags, PostHashtags, Reports } = require('../models');
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
      const fourteenDaysAgo = new Date(today);
      fourteenDaysAgo.setDate(today.getDate() - 14);
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      const oneDayAgo = new Date(today); // 오늘 날짜를 복사합니다.
      oneDayAgo.setDate(oneDayAgo.getDate() - 1); // 오늘 날짜에서 1일을 뺍니다.
      const startOfOneDayAgo = new Date(oneDayAgo.getFullYear(), oneDayAgo.getMonth(), oneDayAgo.getDate(), 0, 0, 0); // 하루 전의 시작 시간
      const endOfOneDayAgo = new Date(oneDayAgo.getFullYear(), oneDayAgo.getMonth(), oneDayAgo.getDate(), 23, 59, 59); // 하루 전의 끝 시간
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

      const usersCreatedLastWeek = await Users.count({
        where: {
          created_at: {
            [Op.gte]: fourteenDaysAgo,
            [Op.lte]: sevenDaysAgo,
          },
          deleted_at: null,
        },
      });

      const usersCreatedThisWeek = await Users.count({
        where: {
          created_at: {
            [Op.gte]: oneWeekAgo,
            [Op.lte]: today,
          },
          deleted_at: null,
        },
      });

      const usersCreatedToday = await Users.count({
        where: {
          created_at: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay,
          },
          deleted_at: null,
        },
      });

      const visitorsLastWeek = await VisitorLogs.count({
        where: {
          createdAt: {
            [Op.gte]: fourteenDaysAgo,
            [Op.lte]: sevenDaysAgo,
          },
          contents: '로그인',
        },
      });

      const visitorsThisWeek = await VisitorLogs.count({
        where: {
          createdAt: {
            [Op.gte]: oneWeekAgo,
            [Op.lte]: today,
          },
          contents: '로그인',
        },
      });

      const visitorsYesterday = await VisitorLogs.count({
        where: {
          createdAt: {
            [Op.gte]: startOfOneDayAgo,
            [Op.lte]: endOfOneDayAgo,
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
          contents: '로그인',
        },
      });

      const postsCreatedLastWeek = await Posts.count({
        where: {
          created_at: {
            [Op.gte]: fourteenDaysAgo,
            [Op.lte]: sevenDaysAgo,
          },
          deleted_at: null,
        },
      });

      const postsCreatedThisWeek = await Posts.count({
        where: {
          created_at: {
            [Op.gte]: oneWeekAgo,
            [Op.lte]: today,
          },
          deleted_at: null,
        },
      });

      const postsCreatedYesterday = await Posts.count({
        where: {
          created_at: {
            [Op.gte]: startOfOneDayAgo,
            [Op.lte]: endOfOneDayAgo,
          },
          deleted_at: null,
        },
      });

      const postsCreatedToday = await Posts.count({
        where: {
          created_at: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay,
          },
          deleted_at: null,
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
        usersCreatedLastWeek,
        usersCreatedThisWeek,
        usersCreatedToday,
        visitorsLastWeek,
        visitorsThisWeek,
        visitorsYesterday,
        visitorsToday,
        postsCreatedLastWeek,
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
