const path = require('path');
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cron = require('node-cron');

const redisClient = require('./middlewares/redis.middleware');

const accountRouter = require('./routes/account.routes');
const commentsRouter = require('./routes/comments.routes');
const adminNoticeRouter = require('./routes/admin.notices.routes');
const postLikeRouter = require('./routes/postLike.routes');
const userFollowRouter = require('./routes/userFollow.routes');
const hashTagRouter = require('./routes/hashtag.routes');
const adminUserBanRouter = require('./routes/admin.user.ban.routes');
const postRouter = require('./routes/posts.routes');
const reportRouter = require('./routes/reports.routes');
const parsing = require('./routes/crawled.routes');
const { CrawledRecipes } = require('./models');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

redisClient.connect();

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

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, './public/login.html'));
});

app.get('/info', (req, res) => {
  res.sendFile(path.join(__dirname, './public/info.html'));
});

app.get('/myPost', (req, res) => {
  res.sendFile(path.join(__dirname, './public/myPost.html'));
});

app.get('/myLikePost', (req, res) => {
  res.sendFile(path.join(__dirname, './public/myLikePost.html'));
});

app.get('/myFollow', (req, res) => {
  res.sendFile(path.join(__dirname, './public/myFollow.html'));
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

// 좋아요 게시물 페이지
app.get('/users/:user_id/liked_posts', (req, res) => {
  const { user_id } = req.params;
  res.sendFile(path.join(__dirname, './public/post.like.html'));
});

//팔로워 페이지
app.get('/users/:user_id/followers', (req, res) => {
  const { user_id } = req.params;
  res.sendFile(path.join(__dirname, './public/user.follow.html'));
});

cron.schedule('0 3 * * *', () => {
  const totalPages = 1;
  const keyword = '레시피';

  for (let page = 1; page <= totalPages; page++) {
    setTimeout(function () {
      parsing(keyword, page);
    }, 10000 * page);
  }
});

app.get('/api/getCrawledRecipes', async (req, res) => {
  try {
    // 모든 크롤링 데이터를 검색합니다.
    const recipes = await CrawledRecipes.findAll();

    res.status(200).json({ data: recipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '데이터 검색 중에 오류가 발생했습니다.' });
  }
});

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});

// // Unhandled Promise Rejection 처리
// process.on('unhandledRejection', (reason, promise) => {
//   console.error('promise:', promise, 'reason:', reason);
// });

// // ChatGPT를 호출하는 비동기 함수를 정의합니다.
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

// // '/ask' 경로의 GET 요청을 처리
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
