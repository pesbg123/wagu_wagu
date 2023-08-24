const express = require('express');
const router = express.Router();
const HashtagsController = require('../controllers/hashtags.controller');
const hashtagsController = new HashtagsController();

// POST admin-hashtag
router.post('/hashtags', hashtagsController.createHashtag.bind(hashtagsController));

// GET hashtags - all
router.get('/hashtags', hashtagsController.getHashtags.bind(hashtagsController));

//  GET hashtags - One
router.get('/hashtags/:id', hashtagsController.getHashtag.bind(hashtagsController));

// PUT admin-hashtag
router.put('/hashtags/:id', hashtagsController.updateHashtag.bind(hashtagsController));

// DELETE admin-hashtag
router.delete('/hashtags/:id', hashtagsController.deleteHashtag.bind(hashtagsController));

module.exports = router;
