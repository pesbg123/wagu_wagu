const AdminHashtagsService = require('../services/hashtags.service');

class AdminHashtagsController {
  constructor() {
    this.adminHashtagsService = new AdminHashtagsService();
  }
  // POST admin-hashtag
  async createHashtag(req, res) {
    try {
      const { hashtag } = req.body;
      if (hashtag === '#' || !hashtag || !hashtag.includes('#'))
        return res.status(400).json({ errorMessage: '#으로 시작하는 해시테그를 입력해주세요.' });

      const newHashtag = await this.adminHashtagsService.createHashtag(hashtag);
      return res.status(200).json({ message: '해시테그 등록에 성공했습니다.', newHashtag });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errorMessage: error.message });
    }
  }

  // GET hashtags - all
  async getHashtags(req, res) {
    try {
      const hashtagList = await this.adminHashtagsService.getHashtags();
      return res.status(200).json(hashtagList);
    } catch (error) {
      console.log(error);
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message, data: [] });
      return res.status(500).json({ errorMessage: '해시테그 목록 조회에 실패했습니다.' });
    }
  }

  // GET hashtags - One
  async getHashtag(req, res) {
    try {
      const { id } = req.params;
      const hashtag = await this.adminHashtagsService.getHashtag(id);
      return res.status(200).json(hashtag);
    } catch (error) {
      console.log(error);
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message, data: [] });
      return res.status(500).json({ errorMessage: '해시테그 조회에 실패했습니다.' });
    }
  }

  // PUT admin-hashtag
  async updateHashtag(req, res) {
    try {
      const { id } = req.params;
      const { hashtag } = req.body;
      if (hashtag === '#' || !hashtag || !hashtag.includes('#'))
        return res.status(400).json({ errorMessage: '#으로 시작하는 해시테그를 입력해주세요.' });

      await this.adminHashtagsService.updateHashtag(id, hashtag);
      return res.status(200).json({ message: '해시테그 수정에 성공했습니다.' });
    } catch (error) {
      console.log(error);
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message });
      return res.status(500).json({ errorMessage: error.message });
    }
  }

  // DELETE admin-hashtag
  async deleteHashtag(req, res) {
    try {
      const { id } = req.params;

      await this.adminHashtagsService.deleteHashtag(id);
      return res.status(200).json({ message: '해시테그 삭제에 성공했습니다.' });
    } catch (error) {
      console.log(error);
      if (error.errorCode) return res.status(error.errorCode).json({ errorMessage: error.message });
      return res.status(500).json({ errorMessage: error.message });
    }
  }
}

module.exports = AdminHashtagsController;
