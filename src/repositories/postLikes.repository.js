const { PostLikes, Posts } = require('../models');

class PostLikesRepository {
  // 게시글 상세 조회 임시 테스트
  getPost = async (post_id) => {
    const post = await Posts.findOne({ where: { id: post_id } });
    return post;
  };
  // 이미 좋아요를 눌렀는지 조회
  getPostLike = async (post_id, user_id) => {
    return await PostLikes.findOne({ where: { post_id, user_id } });
  };

  async addPostLike(post_id, user_id) {
    return await PostLikes.create({ post_id, user_id });
  }

  async removePostLike(post_id, user_id) {
    return await PostLikes.destroy({ where: { post_id, user_id } });
  }
}

module.exports = PostLikesRepository;
