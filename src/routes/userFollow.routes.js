const express = require('express');
const router = express.Router();
const AcountMiddleware = require('../middlewares/account.middleware');
const acountMiddleware = new AcountMiddleware();
const UserFollowController = require('../controllers/userFollow.controller');
const userFollowController = new UserFollowController();

router.post('/users/:user_id/followers', acountMiddleware.authenticateAccessToken, userFollowController.addUserFollow.bind(userFollowController));

router.delete(
  '/users/:userId/unfollowers/:targetId',
  acountMiddleware.authenticateAccessToken,
  userFollowController.removeUserFollow.bind(userFollowController),
);

router.get(
  '/users/:user_id/followers',
  acountMiddleware.authenticateAccessToken,
  userFollowController.getUserFollowedUsers.bind(userFollowController),
);

module.exports = router;
