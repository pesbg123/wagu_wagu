const express = require('express');
const router = express.Router();
const { Posts } = require('../models');

const postsPerPage = 1;

router.get('/', async (req, res) => {
  const { page } = req.query;
  const pageNum = parseInt(page) || 1;
  const offset = (pageNum - 1) * postsPerPage;
  const limit = postsPerPage;

  try {
    const posts = await Posts.findAll({
      limit,
      offset,
      order: [['star', 'DESC']],
      // 필요한 경우 관련 모델 포함
      // include: [
      //   {
      //     model: 다른모델,
      //     as: '다른모델별칭',
      //   },
      // ],
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
