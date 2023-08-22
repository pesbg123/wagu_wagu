const express = require('express');
const router = express.Router();
//const authMiddleware = require('../middlewares/auth');
const { followers } = require('../models');

router.post(
  '/:user_id/follow_unfollow',
  /*authMiddleware,*/ async (req, res, next) => {
    const { user_id } = res.locals.user;
    try {
      const targetUserId = req.params.user_id;
      const user = await followers.findByPk(user_id);
      const targetUser = await followers.findByPk(targetUserId);
      if (!targetUser) {
        return res.status(404).send('User not found');
      }

      const isAlreadyFollowing = await user.hasFollowing(targetUser);
      if (isAlreadyFollowing) {
        await user.removeFollowing(targetUser);
        res.status(200).send('Unfollowed');

        // 팔로우/언팔로우 처리 후 2초 이내에 다시 요청이 들어오면 409 (Conflict) 에러 발생
        setTimeout(() => {
          res.locals.isUnfollowed = true;
        }, 2000);
        if (res.locals.isUnfollowed) {
          return res.status(409).send('Already unfollowed');
        }
      } else {
        await user.addFollowing(targetUser);
        res.status(201).send('Followed');

        // 팔로우/언팔로우 처리 후 2초 이내에 다시 요청이 들어오면 409 (Conflict) 에러 발생
        setTimeout(() => {
          res.locals.isFollowed = true;
        }, 2000);
        if (res.locals.isFollowed) {
          return res.status(409).send('Already followed');
        }
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
);

module.exports = router;
