const express = require('express');
const router = express.Router();
//const authMiddleware = require('../middlewares/auth');
const UserFollowController = require('../controllers/userFollow.controller');
const userFollowController = new UserFollowController();

router.post('/users/:user_id/followers', userFollowController.addUserFollow.bind(userFollowController));

router.delete('/users/:user_id/unfollowers', userFollowController.removeUserFollow.bind(userFollowController));

module.exports = router;
