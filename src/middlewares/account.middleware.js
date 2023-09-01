const jwt = require('jsonwebtoken');
const redis = require('redis');
require('dotenv').config();
const env = process.env;

class AuthenticationMiddleware {
  constructor() {}

  generateAccessToken = (user) => {
    const accessToken = jwt.sign({ userId: user.userId }, env.ACCESS_KEY, {
      expiresIn: '10m',
    });
    return accessToken;
  };

  authenticateAccessToken = async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      let accessToken;
      // Bearer 액세스토큰에서 액세스토큰 추출
      if (authHeader) {
        const tokenParts = authHeader.split(' ');
        if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
          accessToken = tokenParts[1];
        }
      }
      res.locals.accessToken = accessToken;

      const decodedToken = jwt.verify(accessToken, env.ACCESS_KEY);

      // 유효한 액세스 토큰이라면 다음 미들웨어나 API 실행
      req.user = { id: decodedToken.userId }; // 사용자 "아이디"를 req.user 객체에 저장

      const redisClient = redis.createClient({
        url: env.REDIS_URL,
        legacyMode: true,
      });

      redisClient.on('connect', () => {
        console.log('===레디스 연결 성공===');
      });

      redisClient.on('error', (error) => {
        throw { errorCode: 500, message: error };
      });

      await redisClient.connect();

      const redisCli = redisClient.v4;

      const refreshToken = await redisCli.get(`userId:${req.user.id}`);

      if (refreshToken === null) {
        return this.authenticateRefreshToken(req, res, next);
      }

      next();
    } catch (error) {
      // 액세스 토큰이 만료되었을 경우, 리프레시 토큰 검증 미들웨어로 이동
      if (error.name === 'TokenExpiredError') {
        const decoded = jwt.decode(res.locals.accessToken);
        req.user = { id: decoded.userId };
        return this.authenticateRefreshToken(req, res, next);
      }
      // 액세스 토큰의 오류라면 오류 메세지
      return res.status(401).json({ message: '액세스 토큰 오류' });
    }
  };

  authenticateRefreshToken = async (req, res, next) => {
    try {
      const redisClient = redis.createClient({
        url: env.REDIS_URL,
        legacyMode: true,
      });

      redisClient.on('connect', () => {
        console.log('===레디스 연결 성공===');
      });

      redisClient.on('error', (error) => {
        throw { errorCode: 500, message: error };
      });

      await redisClient.connect();

      const redisCli = redisClient.v4;

      const refreshToken = await redisCli.get(`userId:${req.user.id}`);

      if (!refreshToken) {
        return res.status(401).json({ message: '리프레시 토큰이 없습니다.' });
      }

      const decodedToken = jwt.verify(refreshToken, env.REFRESH_KEY);

      // 유효한 리프레시 토큰인 경우, 새로운 액세스 토큰 발급
      const newAccessToken = this.generateAccessToken({ userId: decodedToken.userId });
      res.setHeader('Authorization', `Bearer ${newAccessToken}`);
      req.user = { id: decodedToken.userId }; // 사용자 "아이디"를 req.user 객체에 저장
      next();
    } catch (error) {
      // if (error.name === 'TokenExpiredError') {
      //   return res.status(401).json({ message: '리프레시 토큰 만료' });
      // }
      return res.status(401).json({ message: '리프레시 토큰 오류' });
    }
  };
}

module.exports = AuthenticationMiddleware;
