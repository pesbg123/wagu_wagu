const express = require('express');
const router = express.Router();
const HashtagsController = require('../controllers/hashtags.controller');
const hashtagsController = new HashtagsController();

const AcountMiddleware = require('../middlewares/account.middleware');
const acountMiddleware = new AcountMiddleware();

// POST admin-hashtag
router.post(
  '/hashtags',
  acountMiddleware.isAdmin,
  acountMiddleware.authenticateAccessToken,
  hashtagsController.createHashtag.bind(hashtagsController),
);

// GET hashtags - all
router.get('/hashtags', hashtagsController.getHashtags.bind(hashtagsController));

//  GET hashtags - One
router.get(
  '/hashtags/:id',
  acountMiddleware.isAdmin,
  acountMiddleware.authenticateAccessToken,
  hashtagsController.getHashtag.bind(hashtagsController),
);

// PUT admin-hashtag
router.put(
  '/hashtags/:id',
  acountMiddleware.isAdmin,
  acountMiddleware.authenticateAccessToken,
  hashtagsController.updateHashtag.bind(hashtagsController),
);

// DELETE admin-hashtag
router.delete(
  '/hashtags/:id',
  acountMiddleware.isAdmin,
  acountMiddleware.authenticateAccessToken,
  hashtagsController.deleteHashtag.bind(hashtagsController),
);

module.exports = router;
