const { Hashtags } = require('../models');

class AdminHashtagsRepository {
  // POST admin-hashtag
  async createHashtag(hashtag) {
    return await Hashtags.create({ hashtag });
  }

  // GET hashtags - all
  async getHashtags() {
    return await Hashtags.findAll({ raw: true });
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
