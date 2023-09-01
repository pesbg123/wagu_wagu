const PostLikesService = require('../services/postLikes.service');

const user_id = 1; // hard coding

class PostLikesController {
  constructor() {
    this.postLikesService = new PostLikesService();
  }

  async addPostLike(req, res) {
    try {
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
      const { post_id } = req.params;

      const message = await this.postLikesService.removePostLike(post_id, user_id);

      return res.status(200).json({ message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ errorMessage: error.message });
    }
  }
}

module.exports = PostLikesController;
