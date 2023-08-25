const { Posts } = require('../models');
const { Op } = require('sequelize');

class PostsRespository {
  createPost = async (user_id, title, ingredient, recipe, food_img) => {
    const createPostData = await Posts.create({ user_id, title, ingredient, recipe, food_img });

    return createPostData;
  };

  findPosts = async () => {
    const findPostsData = await Posts.findAll();

    return findPostsData;
  };

  findOnePost = async (id) => {
    const findOnePostData = await Posts.findOne({ where: { id } });

    return findOnePostData;
  };

  findUserPosts = async (user_id) => {
    const findUserPostsData = await Posts.findAll({ where: { user_id } });

    return findUserPostsData;
  };

  updatePost = async (id, user_id, title, ingredient, recipe, food_img) => {
    const updatePostData = await Posts.update({ title, ingredient, recipe, food_img }, { where: { id, user_id } });

    return updatePostData;
  };

  deletePost = async (id, user_id) => {
    const deletePostData = await Posts.destroy({ where: { id, user_id } });

    return deletePostData;
  };
}

module.exports = PostsRespository;
