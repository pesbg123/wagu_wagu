const PostLikesService = require('../services/postLikes.service');

class PostLikesController {
  constructor() {
    this.postLikesService = new PostLikesService();
  }

  async addPostLike(req, res) {
    try {
      const { id: user_id } = req.user;
      const { post_id } = req.params;

      const message = await this.postLikesService.addPostLike(post_id, user_id);
      return res.status(200).json({ message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ errorMessage: error.message });
    }
  }
  async removePostLike(req, res) {
    try {
      const { id: user_id } = req.user;
      const { post_id } = req.params;

      const message = await this.postLikesService.removePostLike(post_id, user_id);

      return res.status(200).json({ message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ errorMessage: error.message });
    }
  }

  async getUserLikedPosts(req, res) {
    try {
      const { id: user_id } = req.user;
      const { user_id: paramUserId } = req.params;
      const { page } = req.query;

      const { likedPosts, likedPostsCount } = await this.postLikesService.getUserLikedPosts(user_id, paramUserId, page);

      // 페이지 관련 로직 수정
      const limit = 20;
      const maxPageCount = Math.ceil(likedPostsCount / limit);
      const present = page > maxPageCount ? maxPageCount : page;

      const result = {
        page: {
          present,
          max: maxPageCount,
          min: present - 9 > 0 ? present - 9 : 1,
          maxPageCount,
        },
        data: {
          list: likedPosts,
          count: likedPostsCount,
        },
      };

      res.status(200).json(result);
    } catch (error) {
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message });
      res.status(500).json({ errorMessage: '게시물 좋아요 조회 중 오류가 발생했습니다.' });
    }
  }
}

module.exports = PostLikesController;
