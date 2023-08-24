const CustomError = require('../errors/customError');
const PostsRespository = require('../repositories/posts.repository');

class PostsService {
  postsRespository = new PostsRespository();

  createPost = async (user_id, title, ingredient, recipe, food_img) => {
    if (!title) {
      throw new CustomError('제목을 입력해주세요.', 400);
    }

    if (!ingredient) {
      throw new CustomError('재료를 입력해주세요.', 400);
    }

    if (!recipe) {
      throw new CustomError('조리법을 입력해주세요.', 400);
    }

    if (!food_img) {
      throw new CustomError('요리 사진을 등록해주세요.', 400);
    }

    const createPostData = await this.postsRespository.createPost(user_id, title, ingredient, recipe, food_img);

    return createPostData;
  };

  findPosts = async () => {
    const findPostsData = await this.postsRespository.findPosts();

    return findPostsData;
  };

  findOnePost = async (id) => {
    const findOnePostData = await this.postsRespository.findOnePost(id);

    if (findOnePostData.deleted_at !== 'null') {
      throw new CustomError('삭제된 게시물 입니다.', 404);
    }

    return findOnePostData;
  };

  updatePost = async (id, user_id, title, ingredient, recipe, food_img) => {
    const findOnePostData = await this.postsRespository.findOnePost(id);

    if (findOnePostData.deleted_at !== 'null') {
      throw new CustomError('삭제된 게시물 입니다.', 404);
    }

    const updatePostData = await this.postsRespository.updatePost(id, user_id, title, ingredient, recipe, food_img);

    return updatePostData;
  };

  deletePost = async (id, user_id) => {
    const findOnePostData = await this.postsRespository.findOnePost(id);

    if (findOnePostData.deleted_at !== 'null') {
      throw new CustomError('이미 삭제된 게시물 입니다.', 404);
    }

    const deletePostData = await this.postsRespository.deletePost(id, user_id);

    return deletePostData;
  };
}

module.exports = PostsService;
