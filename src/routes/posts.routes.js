const express = require('express');
const router = express.Router();
const Posts = require('../controllers/posts.controller');
const posts = new Posts();
// auth-middleware incomplete stage
// admin-middleware incomplete stage

router.post('/posts', posts.createPost);

router.get('/posts', posts.findPosts);

router.get('/posts/:id', posts.findOnePost);

router.patch('/posts/:id', posts.updatePost);

router.delete('/posts/:id', posts.deletePost);

module.exports = router;
