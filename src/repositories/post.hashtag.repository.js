const { PostHashtags, Posts, Users } = require('../models');

class PostHashtagsRepository {
  createPostHashtag = async (post_id, hashtag_id) => {
    const createPostHashtagData = await PostHashtags.create({ post_id, hashtag_id });

    return createPostHashtagData;
  };

  findByHashtagId = async (hashtag_id) => {
    const findByHashtagIdData = await PostHashtags.findAll({
      where: { hashtag_id },
      include: [
        {
          model: Posts,
          attributes: ['title', 'food_img', 'id', 'created_at', 'like'],
          include: [
            {
              model: Users,
              attributes: ['nickname'],
            },
          ],
        },
      ],
    });
    return findByHashtagIdData;
  };
}

module.exports = PostHashtagsRepository;
