const path = require('path');
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const redis = require('redis');

const accountRouter = require('./routes/account.routes');
const commentsRouter = require('./routes/comments.routes');
const adminNoticeRouter = require('./routes/admin.notices.routes');
const postLikeRouter = require('./routes/postLike.routes');
const userFollowRouter = require('./routes/userFollow.routes');
const hashTagRouter = require('./routes/hashtag.routes');
const adminUserBanRouter = require('./routes/admin.user.ban.routes');
const postRouter = require('./routes/posts.routes');
const reportRouter = require('./routes/reports.routes');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  legacyMode: true,
});

redisClient.on('connect', () => {
  console.log('Redis 연결 성공');
});

redisClient.on('error', (error) => {
  console.error('Redis 연결 오류:', error);
});

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

// 메인
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/posts', (req, res) => {
  res.sendFile(path.join(__dirname, './public/createPost.html'));
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

// 공지 상세 페이지
app.get('/notice/:notice_id', (req, res) => {
  const { notice_id } = req.params;
  res.sendFile(path.join(__dirname, './public/notice.html'));
});

// food_page
app.get('/food_page', (req, res) => {
  res.sendFile(path.join(__dirname, './public/food_page.html'));
});

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});

// Unhandled Promise Rejection 처리
process.on('unhandledRejection', (reason, promise) => {
  console.error('promise:', promise, 'reason:', reason);
});

// ChatGPT를 호출하는 비동기 함수를 정의합니다.
// async function callChatGPT(prompt) {
//   try {
//     const response = await axios.post(
//       'https://api.openai.com/v1/chat/completions',
//       {
//         prompt: prompt,
//         max_tokens: 100,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//       },
//     );

//     return response.data.choices[0].text;
//   } catch (error) {
//     console.error('Error calling ChatGPT API:', error);
//     return null;
//   }
// }

// '/ask' 경로의 GET 요청을 처리
// app.get('/chatGPT', async function (req, res) {
//   res.sendFile(path.join(__dirname, './public/chatGPT.html')); // askgpt.html 파일을 보내줍니다.
// });

// // '/ask' 경로의 POST 요청을 처리
// app.post('/chatGPT', async (req, res) => {
//   const prompt = req.body.prompt;
//   const response = await callChatGPT(prompt);

//   if (response) {
//     res.json({ response: response });
//   } else {
//     res.status(500).json({ error: 'Failed to get response from ChatGPT API' });
//   }
//   app.use((req, res, next) => {
//     indexMiddleware.indexToken(req, res, next);
//   });
// });
