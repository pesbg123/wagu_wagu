const express = require('express');
const commentsRouter = express.Router();

//const AuthMiddleware = require('../middleware/auth.middleware');
//const auth = new AuthMiddleware();

const CommentsController = require('../controllers/comment.controller');
const commentsController = new CommentsController();

// 대댓글 작성
commentsRouter.post('/comments/:post_id/:parent_id', commentsController.createReply);

// 소프트 삭제된 댓글 조회
commentsRouter.get('/comments/soft-deleted', commentsController.findSoftDeletedComments);

// 댓글 게시물 조회
commentsRouter.get('/comments/:post_id', commentsController.findAllComment);

// 댓글 전체 조회
commentsRouter.get('/comments', commentsController.findComments);

/* 댓글 조회
commentsRouter.get('/comments/:id', commentsController.findPostComment);*/

// 댓글 작성
commentsRouter.post('/comments/:post_id', /*auth.verifyAccessToken,*/ commentsController.createComment);

// 댓글 수정
commentsRouter.put(
  '/comments/:id',
  /*auth.verifyAccessToken,*/
  commentsController.updateComment,
);

//댓글 삭제
commentsRouter.delete(
  '/comments/:id',
  /*auth.verifyAccessToken,*/
  commentsController.deleteComment,
);

/*commentsRouter.put(
  '/reply/:reply_id',
  /*auth.verifyAccessToken,
  commentsController.updateReply,
)
commentsRouter.delete('/reply/:comment_id', /*auth.verifyAccessToken, commentsController.deleteReply)*/

module.exports = commentsRouter;