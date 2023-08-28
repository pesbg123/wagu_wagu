const path = require('path');
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;

const adminNoticeRouter = require('./routes/admin.notices.routes');
const postLikeRouter = require('./routes/postLike.routes');
const userFollowRouter = require('./routes/userFollow.routes');
const hashTagRouter = require('./routes/hashtag.routes');
const adminUserBanRouter = require('./routes/admin.user.ban.routes');
const postRouter = require('./routes/posts.routes');
const reportRouter = require('./routes/reports.routes');

app.use(express.json());

app.use('/api', [adminNoticeRouter, hashTagRouter, postLikeRouter, userFollowRouter, hashTagRouter, adminUserBanRouter, postRouter, reportRouter]);

app.use(express.static(path.join(__dirname, './public')));

// 메인
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// 어드민 페이지
app.get('/admin_page', (req, res) => {
  res.sendFile(path.join(__dirname, './public/admin.index.html'));
});

// 어드민 notices 페이지
app.get('/admin_notices', (req, res) => {
  res.sendFile(path.join(__dirname, './public/admin.notices.html'));
});

// 어드민 hashtags 페이지
app.get('/admin_hashtags', (req, res) => {
  res.sendFile(path.join(__dirname, './public/admin.hashtags.html'));
});

// 어드민 reports 페이지
app.get('/admin_reports', (req, res) => {
  res.sendFile(path.join(__dirname, './public/admin.reports.html'));
});

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
