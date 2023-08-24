const PostsService = require('../services/posts.service');

const user_id = 1;

class PostsController {
  postsService = new PostsService();

  createPost = async (req, res, next) => {
    try {
      // const { user_id } = req.user;
      const { title, ingredient, recipe, food_img } = req.body;

      const createPostData = await this.postsService.createPost(user_id, title, ingredient, recipe, food_img);

      return res.status(201).json({ message: '게시글을 생성하였습니다.', data: createPostData });
    } catch (error) {
      console.error(error);
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message });
      return res.status(500).json({ errorMessage: '게시글 생성에 실패하였습니다.' });
    }
  };

  findPosts = async (req, res) => {
    try {
      const findPostsData = await this.postsService.findPosts();

      return res.status(200).json({ data: findPostsData });
    } catch (error) {
      console.error(error);
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message });
      return res.status(500).json({ errorMessage: '게시글 조회에 실패하였습니다.' });
    }
  };

  findOnePost = async (req, res) => {
    try {
      const { id } = req.params;

      const findOnePostData = await this.postsService.findOnePost(id);

      return res.status(200).json({ data: findOnePostData });
    } catch (error) {
      console.error(error);
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message });
      return res.status(500).json({ errorMessage: ' 게시글 상세조회의 실패하였습니다.' });
    }
  };

  updatePost = async (req, res, next) => {
    try {
      const { id } = req.params;
      // const { user_id } = req.user;
      const { title, ingredient, recipe, food_img } = req.body;

      await this.postsService.updatePost(id, user_id, title, ingredient, recipe, food_img);

      return res.status(200).json({ message: '게시글을 수정하였습니다.' });
    } catch (error) {
      console.error(error);
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message });
      return res.status(500).json({ errorMessage: '게시글 수정에 실패하였습니다.' });
    }
  };

  deletePost = async (req, res, next) => {
    try {
      const { id } = req.params;
      // const { user_id } = req.user;

      await this.postsService.deletePost(id, user_id);

      return res.status(200).json({ message: '게시글을 삭제하였습니다.' });
    } catch (error) {
      console.error(error);
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message });
      return res.status(500).json({ errorMessage: '게시글 삭제에 실패하였습니다.' });
    }
  };
}

module.exports = PostsController;
