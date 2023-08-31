const { Reports, Users, Posts, Comments } = require('../models');
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
        [Op.and]: [{ user_id }, { post_id }, { comment_id: null }],
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
        },
        {
          model: Posts,
        },
        { model: Comments },
      ],
    });
  }

  // GET TEST 때문애 임시로 댓글 조회 코드 작성
  async findOneComment(id) {
    return await Comments.findOne({ raw: true, where: { id } });
  }
}

module.exports = ReportRepository;
