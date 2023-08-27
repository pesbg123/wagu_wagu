const { Reports, Users, Posts } = require('../models');
const { Op } = require('sequelize');

class ReportRepository {
  // POST reportPost
  async reportPost(user_id, post_id, report_type, reported_reason) {
    console.log(user_id, post_id, reported_reason);

    return await Reports.create({ user_id, post_id, report_type, reported_reason });
  }

  // POST reportComment
  async reportComment(user_id, post_id, comment_id, report_type, reported_reason) {
    return await Reports.create({ user_id, post_id, comment_id, report_type, reported_reason });
  }

  // GET reportPost - One
  async getPostReport(user_id, post_id) {
    return await Reports.findOne({
      raw: true,
      where: {
        [Op.and]: [{ user_id }, { post_id }],
      },
    });
  }

  // GET reportComment - One
  async getCommentReport(user_id, post_id, comment_id) {
    return await Reports.findOne({
      raw: true,
      where: {
        [Op.and]: [{ user_id }, { post_id }, { comment_id }],
      },
    });
  }

  // GET report-list - All (admin)
  async getReportList() {
    return await Reports.findAll({
      raw: true,
      include: [
        {
          model: Users,
          attributes: ['nickname'],
        },
        {
          model: Posts,
          attributes: ['title'],
        },
      ],
    });
  }
}

// GET report-list (신고횟수를 가져오기 위해 조회)
module.exports = ReportRepository;
