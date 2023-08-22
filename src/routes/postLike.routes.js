const express = require('express');
const router = express.Router();
// const authMiddleware = require('../middlewares/auth');
const PostLikesController = require('../controllers/postLikes.controller');
const postLikesController = new PostLikesController();

//좋아요 api
router.post('/posts/:post_id/likes', postLikesController.addPostLike.bind(postLikesController));

// /*authMiddleware,*/ async (req, res) => {
//   const { postId } = req.params;
//   const { user_id } = res.locals.user;

//   try {
//     const existPost = await Posts.findOne({ where: { id: postId } });

//     if (!existPost) {
//       return res.status(404).json({ errorMessage: '존재하지 않는 게시물입니다.' });
//     }

//     const existLike = await Likes.findOne({ where: { post_id: postId, user_id } });
//     if (!existLike) {
//       await Likes.create({ user_id, post_id: postId });
//     } else {
//       await Likes.destroy({ where: { user_id, post_id: postId } });
//     }

//     res.status(200).json({ message: '좋아요 등록 성공' });
//   } catch (error) {
//     console.error('오류가 발생했습니다.', error);
//     res.status(500).json({ errorMessage: '좋아요 등록 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
//   }
// },

// ---------------
// // 게시물 삭제 시 좋아요 자동 삭제
// router.delete(
//   '/posts/:postId',
//   /*authMiddleware,*/ async (req, res) => {
//     const { postId } = req.params;

//     try {
//       const existPost = await Posts.findOne({ where: { id: postId } });

//       if (!existPost) {
//         return res.status(404).json({ errorMessage: '해당 게시물을 찾지 못했습니다.' });
//       }

//       await Likes.destroy({ where: { post_id: postId } });

//       await Posts.destroy({ where: { id: postId } });

//       res.status(200).json({ message: '게시물 삭제 성공' });
//     } catch (error) {
//       console.error('오류가 발생했습니다.', error);
//       res.status(500).json({ errorMessage: '게시물 삭제 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
//     }
//   },
// );

module.exports = router;
