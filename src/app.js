const path = require('path');
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const commentsRouter = require('./routes/comments.routes');
const adminNoticeRouter = require('./routes/admin.notices.routes');
const postLikeRouter = require('./routes/postLike.routes');
const userFollowRouter = require('./routes/userFollow.routes');
const hashTagRouter = require('./routes/hashtag.routes');
const adminUserBanRouter = require('./routes/admin.user.ban.routes');
const postRouter = require('./routes/posts.routes');

app.use(express.json());

app.use('/api', [adminNoticeRouter, hashTagRouter, postLikeRouter, userFollowRouter, hashTagRouter, adminUserBanRouter, postRouter, commentsRouter]);

app.use(express.static(path.join(__dirname, './public')));

// 메인

// food_page
app.get('/food_page', (req, res) => {
  res.sendFile(path.join(__dirname, './public/food_page.html'));
});

// test
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index1.html'));
});

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
