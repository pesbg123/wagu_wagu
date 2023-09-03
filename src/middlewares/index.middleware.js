const AuthenticationMiddleware = require('./account.middleware');
const redis = require('redis');
require('dotenv').config();
const env = process.env;

class indexMiddleware {
  constructor() {
    this.authenticationMiddleware = new AuthenticationMiddleware();

    // 레디스 클라이언트를 생성하고 인스턴스 변수에 저장
    this.redisClient = redis.createClient({
      url: env.REDIS_URL,
      legacyMode: true,
    });

    this.redisClient.on('connect', () => {
      console.log('=== index 레디스 연결 성공 ===');
    });

    this.redisClient.on('error', (error) => {
      throw { errorCode: 500, message: error };
    });

    this.redisClient.connect();
  }

  indexToken = async (req, res, next) => {
    console.log(req.headers.cookie);
    const authHeader = req.headers.cookie['accessToken'];
    console.log(authHeader);
    let accessToken;

    if (authHeader) {
      console.log(1);
      const tokenParts = authHeader.split(' ');
      if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
        accessToken = tokenParts[1];
      }

      const redisCli = this.redisClient;

      const refreshToken = await redisCli.get(`userId:${req.user.id}`);

      console.log('=== index 레디스 연결 종료 ===');

      this.redisClient.quit();

      if (!refreshToken) {
        res.setHeader('Authorization', '');
        return next();
      }

      this.authenticationMiddleware.authenticateAccessToken(req, res, () => {
        return res.json({ message: '토큰이 모두 유효한 사용자' });
      });
    } else {
      next();
    }
  };
}

module.exports = indexMiddleware;
