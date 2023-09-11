const express = require('express');
const router = express.Router();
const { Posts } = require('../models');

const postsPerPage = 12;

router.get('/scroll', async (req, res) => {
  const { page } = req.query;
  const pageNum = parseInt(page) || 1;
  const offset = (pageNum - 1) * postsPerPage;
  const limit = postsPerPage;

  try {
    const posts = await Posts.findAll({
      limit,
      offset,
      order: [['star', 'DESC']],
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
