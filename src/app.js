const path = require('path');
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// const IndexMiddleware = require('./middlewares/index.middleware');
// const indexMiddleware = new IndexMiddleware();

const accountRouter = require('./routes/account.routes');
const commentsRouter = require('./routes/comments.routes');
const adminNoticeRouter = require('./routes/admin.notices.routes');
const postLikeRouter = require('./routes/postLike.routes');
const userFollowRouter = require('./routes/userFollow.routes');
const hashTagRouter = require('./routes/hashtag.routes');
const adminUserBanRouter = require('./routes/admin.user.ban.routes');
const postRouter = require('./routes/posts.routes');

require('./routes/test');
const reportRouter = require('./routes/reports.routes');

app.use(express.json());

app.use('/api', [
  accountRouter,
  adminNoticeRouter,
  hashTagRouter,
  postLikeRouter,
  userFollowRouter,
  hashTagRouter,
  adminUserBanRouter,
  postRouter,
  reportRouter,
  commentsRouter,
]);

app.use(express.static(path.join(__dirname, './public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// 어드민 페이지
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, './public/admin.index.html'));
});

// 어드민 notices 페이지
app.get('/admin/notices', (req, res) => {
  res.sendFile(path.join(__dirname, './public/admin.notices.html'));
});

// 어드민 hashtags 페이지
app.get('/admin/hashtags', (req, res) => {
  res.sendFile(path.join(__dirname, './public/admin.hashtags.html'));
});

// 어드민 reports 페이지
app.get('/admin/reports', (req, res) => {
  res.sendFile(path.join(__dirname, './public/admin.reports.html'));
});

// 어드민 block list 페이지
app.get('/admin/block_list', (req, res) => {
  res.sendFile(path.join(__dirname, './public/admin.block.html'));
});

// 어드민 user ban 페이지
app.get('/admin/user_ban', (req, res) => {
  res.sendFile(path.join(__dirname, './public/admin.user.ban.html'));
});

// food_page
app.get('/food_page', (req, res) => {
  res.sendFile(path.join(__dirname, './public/food-page'));
});

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
