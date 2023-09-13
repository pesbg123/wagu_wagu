const { Posts, Users, Comments, PostLikes, Sequelize } = require('../models');

class PostsRespository {
  createPost = async (user_id, title, ingredient, recipe, food_img) => {
    const createPostData = await Posts.create({ user_id, title, ingredient, recipe, food_img });

    return createPostData;
  };

  findPosts = async (limit, offset) => {
    const findPostsData = await Posts.findAll({
      raw: true,
      nest: true,
      limit,
      offset,
      include: [
        {
          model: Users,
          attributes: ['nickname', 'id'],
        },
      ],
    });

    return findPostsData;
  };

  findOnePost = async (id) => {
    const findOnePostData = await Posts.findOne({
      raw: true,
      where: { id },
      include: [
        {
          model: Users,
          attributes: ['id', 'nickname', 'email', 'user_img'],
        },
      ],
    });

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

  blockPost = async (id) => {
    return Posts.update({ is_blocked: true }, { where: { id } });
  };

  unblockPost = async (id) => {
    return Posts.update({ is_blocked: false }, { where: { id } });
  };

  postReportCountIncrease = async (id, report_count) => {
    return Posts.update({ report_count }, { where: { id } });
  };

  findByTitle = async (title) => {
    const findByTitleData = await Posts.findAll({ where: { title: { [Sequelize.Op.like]: `%${title}%` } } });

    return findByTitleData;
  };
}

module.exports = PostsRespository;
