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

      const isAlreadyFollowing = await this.userFollowRepository.findFollower(user_id, target_id);

      if (isAlreadyFollowing) {
        throw new CustomError('이미 팔로우한 사용자입니다.', 400);
      }
      const res = await this.userFollowRepository.addFollower(user_id, target_id);

      if (!res) throw new Error('팔로워 등록에 실패했습니다.');
      return;
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

      // const isAlreadyFollowing = await this.userFollowRepository.isUserFollowing(user_id, target_id);
      const isAlreadyFollowing = await this.userFollowRepository.removeFollower(user_id, target_id);
      if (isAlreadyFollowing) {
        await this.userFollowRepository.removeFollower(user_id, target_id);
        return '팔로우가 취소되었습니다.';
      } else {
        return '이미 팔로우하지 않은 사용자입니다.';
      }
    } catch (error) {
      throw error;
    }
  }
  async getUserFollowedUsers(user_id) {
    try {
      const followedUsers = await this.userFollowRepository.getUserFollowedUsers(user_id);

      return followedUsers;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserFollowService;
