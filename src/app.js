const path = require('path');
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;

const adminNoticeRouter = require('./routes/admin.notices.routes');
const adminUserBanRouter = require('./routes/admin.user.ban.routes');
const hashTagRouter = require('./routes/hashtag.routes');
const postRouter = require('./routes/posts.routes');

app.use(express.json());

app.use('/api', [adminNoticeRouter, hashTagRouter, adminUserBanRouter, postRouter]);

app.use(express.static(path.join(__dirname, './public')));

// 메인
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
