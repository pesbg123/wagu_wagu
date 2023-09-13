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

    // if (!food_img) {
    //   throw new CustomError('요리 사진을 등록해주세요.', 400);
    // }

    const createPostData = await this.postsRespository.createPost(user_id, title, ingredient, recipe, food_img);

    return createPostData;
  };

  findPosts = async (limit, offset) => {
    // limit과 offset을 리포지토리에 전달
    const findPostsData = await this.postsRespository.findPosts(limit, offset);

    return findPostsData;
  };

  findMyPosts = async (id) => {
    const findMyPosts = await this.postsRespository.findUserPosts(id);

    if (Array.isArray(findMyPosts) && findMyPosts.length === 0) {
      throw new CustomError('작성한 게시물이 없습니다.', 404);
    }

    const myPosts = findMyPosts.map((item) => ({
      created_at: item.created_at,
      title: item.title,
      food_img: item.food_img,
      ingredient: item.ingredient,
      recipe: item.recipe,
      like: item.like,
    }));

    return myPosts;
  };

  findOnePost = async (id) => {
    const findOnePostData = await this.postsRespository.findOnePost(id);

    return findOnePostData;
  };

  findUserPosts = async (user_id) => {
    const findUserPostsData = await this.postsRespository.findUserPosts(user_id);

    if (!findUserPostsData) {
      throw new CustomError('해당 사용자가 작성한 게시물이 존재하지 않습니다.', 404);
    }

    return findUserPostsData;
  };

  findNicknamePosts = async (nickname) => {
    const findNicknamePostsData = await this.usersRepository.findNicknamePosts(nickname);

    const findUserPostsData = await this.postsRespository.findUserPosts(findNicknamePostsData.user_id);

    return findUserPostsData;
  };

  updatePost = async (id, user_id, title, ingredient, recipe, food_img) => {
    const updatePostData = await this.postsRespository.updatePost(id, user_id, title, ingredient, recipe, food_img);

    return updatePostData;
  };

  deletePost = async (id, user_id) => {
    const deletePostData = await this.postsRespository.deletePost(id, user_id);

    return deletePostData;
  };

  blockPost = async (id) => {
    const existPost = await this.postsRespository.findOnePost(id);
    if (!existPost) throw new CustomError('해당 게시글이 존재하지 않습니다.', 404);

    if (existPost.is_blocked === true) throw new CustomError('이미 블락된 게시글입니다.', 400);
    const res = await this.postsRespository.blockPost(id);
    if (!res) throw new Error('게시글 블락에 실패했습니다.');
    return;
  };

  unblockPost = async (id) => {
    const existPost = await this.postsRespository.findOnePost(id);
    if (!existPost) throw new CustomError('해당 게시글이 존재하지 않습니다.', 404);

    if (existPost.is_blocked === false) throw new CustomError('블락되지 않은 게시물입니다.', 400);
    const res = await this.postsRespository.unblockPost(id);
    if (!res) throw new Error('게시글 블락 취소에 실패했습니다.');
  };
}

module.exports = PostsService;
