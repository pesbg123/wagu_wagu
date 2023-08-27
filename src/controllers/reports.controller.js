const ReportService = require('../services/reports.service');

const user_id = 1; // temporary hardcoding

class ReportController {
  constructor() {
    this.reportService = new ReportService();
  }

  // POST reportPost
  async reportPost(req, res) {
    try {
      const { post_id } = req.params;
      const { report_type, reported_reason } = req.body;

      await this.reportService.reportPost(user_id, post_id, report_type, reported_reason);
      return res.status(200).json({ message: '해당 게시글을 신고했습니다.' });
    } catch (error) {
      console.log(error);
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message });
      return res.status(500).json({ errorMessage: error.message });
    }
  }

  // POST reportComment
  async reportComment(req, res) {
    try {
      const { post_id, comment_id } = req.params;
      const { report_type, reported_reason } = req.body;
      await this.reportService.reportComment(user_id, post_id, comment_id, report_type, reported_reason);
      return res.status(200).json({ message: '해당 댓글을 신고했습니다.' });
    } catch (error) {
      console.log(error);
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message });
      return res.status(500).json({ errorMessage: error.message });
    }
  }

  // GET reports
  async getReportList(req, res) {
    try {
      const getReportList = await this.reportService.getReportList();
      return res.status(200).json({ getReportList });
    } catch (error) {
      console.log(error);
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message, data: [] });
      return res.status(500).json({ errorMessage: '신고 목록 조회에 실패했습니다.' });
    }
  }
}

module.exports = ReportController;
