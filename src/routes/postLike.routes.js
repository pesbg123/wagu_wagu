const express = require('express');
const router = express.Router();
// const authMiddleware = require('../middlewares/auth');
const PostLikesController = require('../controllers/postLikes.controller');
const postLikesController = new PostLikesController();

//좋아요 api
router.post('/posts/:post_id/likes', postLikesController.addPostLike.bind(postLikesController));

router.post('/posts/:post_id/cancelLikes', postLikesController.removePostLike.bind(postLikesController));

module.exports = router;
