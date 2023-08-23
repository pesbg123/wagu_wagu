const CustomError = require('../errors/customError');
const AdminHashtagsRepository = require('../repositories/hashtags.repository');

class AdminHashtagsService {
  constructor() {
    this.adminHashtagsRepository = new AdminHashtagsRepository();
  }
  // POST admin-hashtag
  async createHashtag(hashtag) {
    const newHashtag = await this.adminHashtagsRepository.createHashtag(hashtag);
    if (!newHashtag) throw new Error('해시테그 등록에 실패했습니다.');
    return newHashtag;
  }

  // GET admin-hashtags - all
  async getHashtags() {
    const hashtagList = await this.adminHashtagsRepository.getHashtags();
    if (!hashtagList.length) throw new CustomError('작성된 해시테그를 찾을 수 없습니다.', 404);
    return hashtagList;
  }

  // GET admin-hashtags - One
  async getHashtag(id) {
    const hashtag = await this.adminHashtagsRepository.getHashtag(id);
    if (!hashtag) throw new CustomError('해당 해시테그를 찾을 수 없습니다.', 404);
    return hashtag;
  }

  // PUT admin-hashtag
  async updateHashtag(id, hashtag) {
    const existHashtag = await this.adminHashtagsRepository.getHashtag(id);
    if (!existHashtag) throw new CustomError('해당 해시테그를 찾을 수 없습니다.', 404);

    const res = await this.adminHashtagsRepository.updateHashtag(id, hashtag);
    if (!res) throw new Error('해시테그 수정에 실패했습니다.');
    return;
  }

  // DELETE admin-hashtag
  async deleteHashtag(id) {
    const existHashtag = await this.adminHashtagsRepository.getHashtag(id);
    if (!existHashtag) throw new CustomError('해당 해시테그를 찾을 수 없습니다.', 404);

    const res = await this.adminHashtagsRepository.deleteHashtag(id);
    if (!res) throw new Error('해시테그 삭제에 실패했습니다.');
    return;
  }
}

module.exports = AdminHashtagsService;
