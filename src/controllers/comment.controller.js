const CommentsService = require('../services/comment.service');
const user_id = 1;

class CommentsController {
  commentsService = new CommentsService();

  //전체 댓글 조회
  findComments = async (req, res) => {
    /*const { admin_id } = req.user;*/
    const { code, data } = await this.commentsService.findComments();
    res.status(code).json({ data });
  };

  // 댓글 게시물 조회
  findAllComment = async (req, res) => {
    const { post_id } = req.params;

    const { code, data } = await this.commentsService.findAllComment({ post_id });
    res.status(code).json({ data });
  };

  //소프트 삭제된 댓글 조회
  findSoftDeletedComments = async (req, res) => {
    console.log('findSoftDeletedComments');
    const { code, data } = await this.commentsService.findSoftDeletedComments();
    res.status(code).json({ data });
  };

  /* 댓글 조회
  findPostComment = async (req, res) => {
    const { id } = req.params;

    const { code, data } = await this.commentsService.findComment({ id });
    res.status(code).json({ data });
  };*/

  // 댓글 생성
  createComment = async (req, res) => {
    //const { user_id } = res.locals.user;
    const { post_id } = req.params;
    const { content } = req.body;

    const { code, data } = await this.commentsService.createComment({
      user_id,
      post_id,
      content,
    });

    res.status(code).json({ data });
  };

  // 댓글 수정
  updateComment = async (req, res) => {
    //const { user_id } = res.locals.user;
    const { id } = req.params;
    const { content } = req.body;

    const { code, data } = await this.commentsService.updateComment({
      user_id,
      id,
      content,
    });
    res.status(code).json({ data });
  };

  // 댓글 삭제
  deleteComment = async (req, res) => {
    const { id } = req.params;
    //const { user_id } = res.locals.user;

    const { code, data } = await this.commentsService.deleteComment({
      id,
      user_id,
    });
    res.status(code).json({ data });
  };

  // 대댓글 생성
  createReply = async (req, res) => {
    console.log(req.params);
    const { post_id, parent_id } = req.params;
    const { content } = req.body;
    //const { user_id } = res.locals.user;

    const { code, json } = await this.commentsService.createReply({
      user_id,
      post_id,
      reply_id: parent_id,
      content,
    });

    res.status(code).json(json);
  };

  /*대댓글 수정
  updateReply = async (req, res) => {
    const { content } = req.body;
    const { reply_id } = req.params;
    //const { user_id } = res.locals.user;

    const { code, json } = await this.commentsService.updateReply({
      user_id,
      reply_id,
      content,
    });

    res.status(code).json(json);
  };

  // 대댓글 삭제
  deleteReply = async (req, res) => {
    const { reply_id } = req.params;
    //const { user_id } = res.locals.user;

    const { code, json } = await this.commentsService.deleteReply({
      user_id,
      reply_id,
    });

    res.status(code).json(json);
  };*/

  // 댓글 블락 메서드입니다.
  blockComment = async (req, res) => {
    try {
      const { post_id, comment_id } = req.params;

      await this.commentsService.blockComment(post_id, comment_id);
      return res.status(200).json({ message: '댓글 블락에 성공했습니다.' });
    } catch (error) {
      console.log(error);
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message });
      return res.status(500).json({ errorMessage: error.message });
    }
  };
  // 댓글 블락 취소 메서드입니다. JH
  unblockComment = async (req, res) => {
    try {
      const { post_id, comment_id } = req.params;

      await this.commentsService.unblockComment(post_id, comment_id);
      return res.status(200).json({ message: '댓글 블락 취소에 성공했습니다.' });
    } catch (error) {
      console.log(error);
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message });
      return res.status(500).json({ errorMessage: error.message });
    }
  };
}
module.exports = CommentsController;
