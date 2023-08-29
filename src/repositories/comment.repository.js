const { Comments, Users /*,AdminNotices*/ } = require('../models');
const { Op } = require('sequelize');

class CommentsRepository {
  // 전체 댓글 조회
  findAll = async (/*admin_id*/) => {
    return await Comments.findAll(/*{ where: { admin_id } }*/);
  };

  // 댓글 게시물 조회
  findAllComment = async ({ post_id }) => {
    return await Comments.findAll({
      where: { post_id },
      include: [
        {
          model: Users,
        },
      ],
    });
  };

  // 소프트 삭제된 댓글 조회
  findSoftDeletedComments = async () => {
    console.log('findSoftDeletedComments');
    return await Comments.findAll({
      where: { deleted_at: { [Op.ne]: null } },
      paranoid: false,
    });
  };

  /* 댓글 조회
  findComment = async ({ id }) => {
    return await Comments.findOne({
      where: { id },
    });
  };*/

  // 댓글 생성
  createComment = async ({ user_id, post_id, content }) => {
    return await Comments.create({
      user_id,
      post_id,
      content,
    });
  };

  // 댓글 아이디 찾기
  findById = async ({ id }) => {
    return await Comments.findOne({ where: { id } });
  };

  // 댓글 수정
  updateComment = async ({ content, user_id, id }) => {
    await Comments.update(
      { content }, // comment 수정
      {
        where: {
          [Op.and]: [{ id }, { User_id: user_id }],
        },
      },
    );
  };

  // 댓글 삭제
  deleteComment = async ({ user_id, id }) => {
    await Comments.destroy({
      where: {
        [Op.and]: [{ id }, { user_id }],
      },
    });
  };

  // 대댓글 생성
  createReply = async ({ user_id, post_id, reply_id, content }) => {
    console.log(user_id, post_id, reply_id, content);
    return await Comments.create({
      user_id,
      post_id,
      reply_id,
      content,
    });
  };

  /* 대댓글 수정
  updateReply = async ({ user_id, reply_id, content }) => {
    const [updatedRows] = await Comments.update(
      { content },
      {
        where: {
          reply_id: reply_id,
          User_id: user_id,
        },
      },
    );
    if (updatedRows > 0) {
      const updatedCommentData = await Comments.findOne({ where: { id: reply_id } });

      if (updatedCommentData) {
        return updatedCommentData.dataValues;
      }
    }
    throw new Error('수정 권한이 없습니다.');
  };

  // 대댓글 삭제
  deleteReply = async ({ user_id, reply_id }) => {
    const deletedRowsCount = await Comments.destroy({
      where: {
        reply_id: reply_id,
        User_id: user_id,
      },
    });
    if (deletedRowsCount > 0) {
      return true;
    }
    throw new Error('삭제할 권한이 없습니다.');
  };*/
}
module.exports = CommentsRepository;