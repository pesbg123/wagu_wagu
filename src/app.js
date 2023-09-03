const path = require('path');
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const IndexMiddleware = require('./middlewares/index.middleware');
const indexMiddleware = new IndexMiddleware();

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

app.use((req, res, next) => {
  indexMiddleware.indexToken(req, res, next);
});

// 메인
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
