const express = require('express');
const router = express.Router();
const AcountMiddleware = require('../middlewares/account.middleware');
const acountMiddleware = new AcountMiddleware();
const PostLikesController = require('../controllers/postLikes.controller');
const postLikesController = new PostLikesController();

//좋아요 api
router.post('/posts/:post_id/likes', acountMiddleware.authenticateAccessToken, postLikesController.addPostLike.bind(postLikesController));

router.delete('/posts/:post_id/cancelLikes', acountMiddleware.authenticateAccessToken, postLikesController.removePostLike.bind(postLikesController));

// 사용자가 좋아요한 게시물 조회
router.get('/posts/liked_posts', acountMiddleware.authenticateAccessToken, postLikesController.getUserLikedPosts.bind(postLikesController));

module.exports = router;
