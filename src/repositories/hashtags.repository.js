const { Hashtags } = require('../models');

class AdminHashtagsRepository {
  // POST admin-hashtag
  async createHashtag(hashtag) {
    return await Hashtags.create({ hashtag });
  }

  // GET hashtags - all
  async getHashtags() {
    const hashtags = await Hashtags.findAll({ raw: true });
    // 해시테그를 가나다 순으로 정렬하기 위해 sort 메서드 사용
    hashtags.sort((a, b) => a.hashtag.localeCompare(b.hashtag));
    return hashtags;
  }

  // GET hashtags - One
  async getHashtag(id) {
    return await Hashtags.findOne({ raw: true, where: { id } });
  }

  // PUT admin-hashtag
  async updateHashtag(id, hashtag) {
    return await Hashtags.update({ hashtag }, { where: { id } });
  }

  // DELETE admin-hashtag
  async deleteHashtag(id) {
    return await Hashtags.destroy({ where: { id } });
  }
}
module.exports = AdminHashtagsRepository;
