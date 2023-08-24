const path = require('path');
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;

const adminNoticeRouter = require('./routes/adminNotices.routes');
const postLikeRouter = require('./routes/postLike.routes');
const userFollowRouter = require('./routes/userFollow.routes');

app.use(express.json());

app.use('/api', [adminNoticeRouter, postLikeRouter, userFollowRouter]);
const hashTagRouter = require('./routes/hashtag.routes');

app.use(express.json());

app.use('/api', [adminNoticeRouter, hashTagRouter]);

app.use(express.static(path.join(__dirname, './public')));

// 메인
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
