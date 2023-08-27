const CustomError = require('../errors/customError');
const PostsRespository = require('../repositories/posts.repository');
const ReportRepository = require('../repositories/reports.repository');

const validReportTypes = ['음란물', '광고', '욕설', '기타'];

class ReportService {
  constructor() {
    this.reportRepository = new ReportRepository();
    this.postsRepository = new PostsRespository();
  }
  // POST reportPost
  async reportPost(user_id, post_id, report_type, reported_reason) {
    if (!validReportTypes.includes(report_type)) throw new CustomError('유효한 신고 유형을 지정해주세요');
    const existPost = await this.postsRepository.findOnePost(post_id);
    const existPostReport = await this.reportRepository.getPostReport(user_id, post_id);

    if (!existPost) throw new CustomError('해당 게시글이 존재하지 않습니다.', 404);
    if (existPostReport) throw new CustomError('이미 신고한 게시글입니다.', 400);

    const reportCount = existPost.report_count;

    if (existPost.is_blocked) throw new CustomError('해당 게시글은 블락 처리가 되어있습니다.', 400);
    if (reportCount >= 2) {
      await this.postsRepository.blockPost(post_id);
    }

    const res = await this.reportRepository.reportPost(user_id, post_id, report_type, reported_reason);
    await this.postsRepository.postReportCountIncrease(post_id, reportCount + 1);

    if (!res) throw new Error('게시글 신고에 실패했습니다.');
    return res;
  }

  // // POST reportComment
  // async reportComment(user_id, post_id, comment_id, report_type, reported_reason) {
  //   if (!validReportTypes.includes(report_type)) throw new CustomError('유효한 신고 유형을 지정해주세요');
  //   const existPost = await this.postsRepository.findOnePost(post_id);
  //   // 코멘트 작업 끝나면 commentRepository로 변경
  //   const existComment = await this.reportRepository.findOneComment(comment_id);
  //   const existCommentReport = await this.reportRepository.getCommentReport(user_id, post_id, comment_id);

  //   if (!existPost) throw new CustomError('해당 게시글이 존재하지 않습니다.', 404);
  //   if (!existComment) throw new CustomError('해당 댓글이 존재하지 않습니다.', 404);
  //   if (existCommentReport) throw new CustomError('이미 신고한 댓글입니다.', 400);

  //   // 댓글 기능 완성되야 test 가능함.
  //   const reportCount = existComment.report_count

  //   if (existComment.is_blocked) throw new CustomError('해당 댓글은 블락 처리가 되어있습니다.', 400);
  //   if (reportCount >= 2) {
  //     await this.commentRepository.blockComment(comment_id);
  //   }

  //   const res = await this.reportRepository.reportComment(user_id, post_id, comment_id, report_type, reported_reason);

  //   if (!res) throw new Error('댓글 신고에 실패했습니다.');
  //   return;
  // }

  // GET reports
  async getReportList() {
    const res = await this.reportRepository.getReportList();
    if (!res.length) throw new CustomError('신고 목록이 존재하지 않습니다.', 404);
    return res;
  }
}

module.exports = ReportService;
