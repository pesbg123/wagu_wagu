const UserFollowRepository = require('../repositories/userFollow.repository');
const CustomError = require('../errors/customError');

class UserFollowService {
  constructor() {
    this.userFollowRepository = new UserFollowRepository();
  }

  async addUserFollow(user_id, target_id) {
    try {
      const existTargetUser = await this.userFollowRepository.findUserById(target_id);

      if (!existTargetUser) {
        throw new CustomError('대상 사용자를 찾을 수 없습니다.', 404);
      }

      const isAlreadyFollowing = await this.userFollowRepository.isUserFollowing(user_id, target_id);

      if (!isAlreadyFollowing) {
        await this.userFollowRepository.addFollower(user_id, target_id);
      }

      return isAlreadyFollowing ? '이미 팔로우한 사용자입니다.' : '팔로우되었습니다.';
    } catch (error) {
      throw error;
    }
  }

  async removeUserFollow(user_id, target_id) {
    try {
      const user = await this.userFollowRepository.findUserById(user_id);
      const targetUser = await this.userFollowRepository.findUserById(target_id);

      if (!targetUser) {
        throw new Error('대상 사용자를 찾을 수 없습니다.');
      }

      const isAlreadyFollowing = await this.userFollowRepository.isUserFollowing(user.id, targetUser.id);

      if (isAlreadyFollowing) {
        await this.userFollowRepository.removeFollower(user.id, targetUser.id);
        return '팔로우가 취소되었습니다.';
      } else {
        return '이미 팔로우하지 않은 사용자입니다.';
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserFollowService;
