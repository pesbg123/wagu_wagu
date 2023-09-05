const express = require('express');
const router = express.Router();
const AcountMiddleware = require('../middlewares/account.middleware');
const acountMiddleware = new AcountMiddleware();
const UserFollowController = require('../controllers/userFollow.controller');
const userFollowController = new UserFollowController();

router.post('/users/:user_id/followers', acountMiddleware.authenticateAccessToken, userFollowController.addUserFollow.bind(userFollowController));

router.delete(
  '/users/:user_id/unfollowers',
  acountMiddleware.authenticateAccessToken,
  userFollowController.removeUserFollow.bind(userFollowController),
);

module.exports = router;
