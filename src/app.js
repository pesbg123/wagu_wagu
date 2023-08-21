require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const path = require('path');

// app.use('/api' /* 라우터*/);

app.use(express.static(path.join(__dirname, './public')));

// 메인
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
