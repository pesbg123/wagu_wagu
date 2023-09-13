const express = require('express');
const commentsRouter = express.Router();

const AuthMiddleware = require('../middlewares/account.middleware');
const authMiddleware = new AuthMiddleware();
//const AuthMiddleware = require('../middleware/auth.middleware');
//const auth = new AuthMiddleware();

const CommentsController = require('../controllers/comment.controller');
const commentsController = new CommentsController();

// 대댓글 작성
commentsRouter.post('/comments/:post_id/:parent_id', authMiddleware.authenticateAccessToken, commentsController.createReply);

// 대댓글 조회
// commentsRouter.get('/post/:post_id/comments/:id', commentsController.getReplyComment);

// 소프트 삭제된 댓글 조회
commentsRouter.get('/comments/soft-deleted', commentsController.findSoftDeletedComments);

// 댓글 게시물 조회
commentsRouter.get('/comments/:post_id', commentsController.findAllComment);

// 댓글 전체 조회
commentsRouter.get('/comments', commentsController.findComments);

/* 댓글 조회
commentsRouter.get('/comments/:id', commentsController.findPostComment);*/

// 댓글 작성
commentsRouter.post('/comments/:post_id', authMiddleware.authenticateAccessToken, commentsController.createComment);

// 댓글 수정
commentsRouter.put('/comments/:id', authMiddleware.authenticateAccessToken, commentsController.updateComment);

//댓글 삭제
commentsRouter.delete('/comments/:id', authMiddleware.authenticateAccessToken, commentsController.deleteComment);

/*commentsRouter.put(
  '/reply/:reply_id',
  /*auth.verifyAccessToken,
  commentsController.updateReply,
)
commentsRouter.delete('/reply/:comment_id', /*auth.verifyAccessToken, commentsController.deleteReply)*/

commentsRouter.patch('/posts/:post_id/comments/:comment_id/block', commentsController.blockComment);

commentsRouter.patch('/posts/:post_id/comments/:comment_id/unblock', commentsController.unblockComment);

module.exports = commentsRouter;
