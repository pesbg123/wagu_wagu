const CommentsRepository = require('../repositories/comment.repository');
const PostsRespository = require('../repositories/posts.repository');
const CustomError = require('../errors/customError');

class CommentsService {
  commentsRepository = new CommentsRepository();
  postsRepository = new PostsRespository();

  // 전체 댓글 조회
  findComments = async () => {
    try {
      const content = await this.commentsRepository.findAll();
      if (content.length === 0) {
        return { code: 404, data: '댓글이 존재하지 않습니다.' };
      }
      return { code: 200, data: content };
    } catch (error) {
      return { code: 500, data: error.message };
    }
  };

  // 댓글 게시물 조회
  findAllComment = async ({ post_id }) => {
    try {
      const content = await this.commentsRepository.findAllComment({ post_id });
      if (content.length === 0) {
        return { code: 404, data: '댓글이 존재하지 않습니다.' };
      }
      return { code: 200, data: content };
    } catch (error) {
      return { code: 500, data: error.message };
    }
  };

  //소프트 삭제된 댓글 조회
  findSoftDeletedComments = async () => {
    console.log('findSoftDeletedComments');
    try {
      const content = await this.commentsRepository.findSoftDeletedComments();
      if (content.length === 0) {
        return { code: 404, data: '댓글이 존재하지 않습니다.' };
      }
      return { code: 200, data: content };
    } catch (error) {
      return { code: 500, data: error.message };
    }
  };

  /* 댓글 조회
  findComment = async ({ id }) => {
    try {
      const content = await this.commentsRepository.findComment({ id });

      return { code: 200, data: content };
    } catch (error) {
      return { code: 500, data: error.message };
    }
  };*/

  // 댓글 작성
  createComment = async ({ user_id, post_id, content }) => {
    if (!content) {
      return { code: 400, data: '댓글 내용을 입력해주세요' };
    }

    try {
      const createdComment = await this.commentsRepository.createComment({
        user_id,
        post_id,
        content,
      });

      // 데이터가 정상적으로 전달되지 못한 경우
      if (!createdComment) return { code: 400, data: '데이터 형식이 올바르지 않습니다.' };

      return { code: 200, data: createdComment };
    } catch (error) {
      return { code: 500, data: error.message };
    }
  };

  // 댓글 수정
  updateComment = async ({ user_id, id, content }) => {
    try {
      const existsComment = await this.commentsRepository.findById({
        id,
      });

      if (!existsComment) {
        return { code: 404, data: ' 댓글이 존재하지 않습니다.' };
      } else if (existsComment.user_id !== user_id) {
        return { code: 401, data: '댓글을 수정할 권한이 없습니다.' };
      }
    } catch (error) {
      return { code: 500, data: error.message };
    }

    // 댓글의 권한을 확인하고, 댓글 수정
    try {
      await this.commentsRepository.updateComment({
        user_id,
        id,
        content,
      });
      return { code: 200, data: '댓글을 수정하였습니다.' };
    } catch (error) {
      return { code: 500, data: error.message };
    }
  };

  // 댓글 삭제
  deleteComment = async ({ id, user_id }) => {
    try {
      const existsComment = await this.commentsRepository.findById({
        id,
      });

      if (!existsComment) {
        return { code: 404, data: ' 댓글이 존재하지 않습니다.' };
      } else if (existsComment.user_id !== user_id) {
        return { code: 401, data: ' 댓글을 삭제할 권한이 없습니다.' };
      }
    } catch (error) {
      return { code: 500, data: error.message };
    }

    try {
      await this.commentsRepository.deleteComment({
        user_id,
        id,
      });
      return { code: 200, data: '댓글을 삭제하였습니다.' };
    } catch (error) {
      return { code: 500, data: error.message };
    }
  };

  // 대댓글 작성
  createReply = async ({ user_id, post_id, reply_id, content }) => {
    console.log(user_id, post_id, reply_id, content);
    if (!content) {
      return { code: 400, json: '대댓글 내용을 입력해주세요.' };
    }

    try {
      const createdComment = await this.commentsRepository.createReply({
        user_id,
        post_id,
        reply_id,
        content,
      });

      // 데이터가 정상적으로 전달되지 못한 경우
      if (!createdComment) return { code: 400, json: '대댓글 작성에 실패했습니다.' };

      return { code: 200, json: createdComment };
    } catch (error) {
      return { code: 500, json: error.message };
    }
  };

  // 대댓글 조회
  // getReplyComment = async (post_id, id) => {
  //   const res = await this.CommentsRepository.getReplyComment(id);
  //   return res;
  // };

  /* 대댓글 수정
  updateReply = async ({ user_id, reply_id, content }) => {
    if (!content) {
      return { code: 400, json: '대댓글 내용을 입력해주세요.' };
    }
    try {
      const updatedreply = await this.commentsRepository.updateReply({
        user_id,
        reply_id,
        content,
      });

      // 데이터가 정상적으로 전달되지 못한 경우
      if (!updatedreply) return { code: 400, json: '대댓글 수정에 실패했습니다.' };

      return { code: 200, json: updatedreply };
    } catch (error) {
      return { code: 500, json: error.message };
    }
  };

  // 대댓글 삭제
  deleteReply = async ({ user_id, reply_id }) => {
    try {
      const deletedComment = await this.commentsRepository.deleteReply({
        user_id,
        reply_id,
      });

      // 데이터가 정상적으로 전달되지 못한 경우
      if (!deletedComment) return { code: 400, json: '대댓글 삭제에 실패했습니다.' };

      return { code: 200, json: '대댓글이 성공적으로 삭제되었습니다.' };
    } catch (error) {
      return { code: 500, json: error.message };
    }
  };*/

  blockComment = async (post_id, comment_id) => {
    console.log('post_id', post_id);
    const existPost = await this.postsRepository.findOnePost(post_id);
    const existComment = await this.commentsRepository.findComment(comment_id);
    if (!existPost) throw new CustomError('해당 게시물이 존재하지 않습니다.', 404);
    if (!existComment) throw new CustomError('해당 댓글이 존재하지 않습니다.', 404);

    if (existComment.is_blocked === true) throw new CustomError('이미 블락된 댓글입니다.', 400);
    const res = await this.commentsRepository.blockComment(comment_id);
    if (!res) throw new Error('댓글 블락에 실패했습니다.');
    return;
  };

  unblockComment = async (post_id, comment_id) => {
    const existPost = await this.postsRepository.findOnePost(post_id);
    const existComment = await this.commentsRepository.findComment(comment_id);
    if (!existPost) throw new CustomError('해당 게시물이 존재하지 않습니다.', 404);
    if (!existComment) throw new CustomError('해당 댓글이 존재하지 않습니다.', 404);

    if (existComment.is_blocked === false) throw new CustomError('블락되지 않은 댓글입니다.', 400);
    const res = await this.commentsRepository.unblockComment(comment_id);
    if (!res) throw new Error('댓글 블락 취소에 실패했습니다.');
  };
}

module.exports = CommentsService;
