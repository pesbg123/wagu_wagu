const PostLikesRepository = require('../repositories/postLikes.repository');
// const PostsRepository = require('../repositories/sdklfjsdkl');

class PostLikesService {
  constructor() {
    this.postLikesRepository = new PostLikesRepository();
    // this.postsRepository = new this.postsRepository();
  }

  async addPostLike(post_id, user_id) {
    // 해당 게시글이 있는지 조회
    const existPost = await this.postLikesRepository.getPost(post_id, user_id);

    if (!existPost) {
      throw new Error('게시물 존재하지 않는다.');
    }

    const existPostLike = await this.postLikesRepository.getPostLike(post_id, user_id);
    if (!existPostLike) {
      const message = await this.postLikesRepository.addPostLike(post_id, user_id);
      if (message) {
        return '좋아요 등록에 성공했습니다.';
      }
    } else {
      throw new Error('좋아요 등록에 실패했다.');
    }
  }

  async removePostLike(post_id, user_id) {
    try {
      const existPostLike = await this.postLikesRepository.getPostLike(post_id, user_id);

      if (existPostLike) {
        await this.postLikesRepository.removePostLike(post_id, user_id);
        return '좋아요 취소에 성공했습니다.';
      } else {
        return '이미 좋아요 취소한 게시글 입니다.';
      }
    } catch (error) {
      throw new Error('좋아요 취소 중 오류가 발생했습니다.');
    }
  }
}

module.exports = PostLikesService;
