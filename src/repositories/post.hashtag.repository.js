const { PostHashtags } = require('../models');

class PostHashtagsRepository {
  createPostHashtag = async (post_id, hashtag_id) => {
    const createPostHashtagData = await PostHashtags.create({ post_id, hashtag_id });

    return createPostHashtagData;
  };
}

module.exports = PostHashtagsRepository;
