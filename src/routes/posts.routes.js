const express = require('express');
const router = express.Router();
const Posts = require('../controllers/posts.controller');
const posts = new Posts();

const AuthMiddleware = require('../middlewares/account.middleware');
const authMiddleware = new AuthMiddleware();
// auth-middleware incomplete stage
// admin-middleware incomplete stage

router.post('/posts', authMiddleware.authenticateAccessToken, posts.createPost);

router.get('/posts', posts.findPosts);

router.get('/posts/user', posts.findUserPosts);

router.get('/posts/nickname', posts.findNicknamePosts);

router.get('/posts/:id', posts.findOnePost);

router.patch('/posts/:id', authMiddleware.authenticateAccessToken, posts.updatePost);

router.delete('/posts/:id', authMiddleware.authenticateAccessToken, posts.deletePost);

router.patch('/posts/:id/block', posts.blockPost);

router.patch('/posts/:id/unblock', posts.unblockPost);

module.exports = router;
