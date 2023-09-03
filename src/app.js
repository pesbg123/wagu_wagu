const path = require('path');
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const axios = require('axios'); // Axios 패키지를 가져옵니다.

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
const reportRouter = require('./routes/reports.routes');
require('./routes/test');

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

// '/ask' 경로의 GET 요청을 처리
app.get('/chatGPT', async function (req, res) {
  res.sendFile(path.join(__dirname, './public/chatGPT.html')); // askgpt.html 파일을 보내줍니다.
});

// '/ask' 경로의 POST 요청을 처리
app.post('/chatGPT', async (req, res) => {
  const prompt = req.body.prompt;
  const response = await callChatGPT(prompt);

  if (response) {
    res.json({ response: response });
  } else {
    res.status(500).json({ error: 'Failed to get response from ChatGPT API' });
  }
  app.use((req, res, next) => {
    indexMiddleware.indexToken(req, res, next);
  });
});

// 메인
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});

// ChatGPT를 호출하는 비동기 함수를 정의합니다.
async function callChatGPT(prompt) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        prompt: prompt,
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      },
    );

    return response.data.choices[0].text;
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    return null;
  }
}
// 메인 페이지를 설정하여 루트 경로('/')에 접근했을 때 index.html 파일을 제공합니다.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});
