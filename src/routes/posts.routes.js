const express = require('express');
const router = express.Router();
const Posts = require('../controllers/posts.controller');
const posts = new Posts();
// auth-middleware incomplete stage
// admin-middleware incomplete stage

//작성
router.post('/posts', posts.createPost);

//전체 게시글 조회
router.get('/posts', posts.findPosts);

//유저 아이디로 조회
router.get('/posts/user', posts.findUserPosts);

//닉네임으로 조회
router.get('/posts/nickname', posts.findNicknamePosts);

//게시글 상세 조회
router.get('/posts/:id', posts.findOnePost);

//게시글 수정
router.patch('/posts/:id', posts.updatePost);

//게시글 삭제
router.delete('/posts/:id', posts.deletePost);

//게시글 블락
router.patch('/posts/:id/block', posts.blockPost);

//게시글 블락 해제
router.patch('/posts/:id/unblock', posts.unblockPost);

module.exports = router;
