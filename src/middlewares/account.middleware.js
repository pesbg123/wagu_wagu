const jwt = require('jsonwebtoken');
const redis = require('redis');
const AccountRepository = require('../repositories/account.repository');
require('dotenv').config();
const env = process.env;

//사용방법
//const AuthenticationMiddleware = require('../middlewares/auth.middleware');
//const authMiddleware = new AuthenticationMiddleware();
//router.post('/comments', authMiddleware.authenticateAccessToken, (req, res) => {}
//어드민 API는 authMiddleware.authenticateAccessToken쓰기 전에 authMiddleware.isAdmin을 추가해서 사용
//유저아이디는 req.user로 받으면 됨.

class AuthenticationMiddleware {
  constructor() {
    this.authRepository = new AccountRepository();

    // 레디스 클라이언트를 생성하고 인스턴스 변수에 저장
    this.redisClient = redis.createClient({
      url: env.REDIS_URL,
      legacyMode: true,
    });

    this.redisClient.on('connect', () => {
      console.log('=== account 레디스 연결 성공 ===');
    });

    this.redisClient.on('error', (error) => {
      throw { errorCode: 500, message: error };
    });

    this.redisClient.connect();
  }

  // getRefreshToken = async (cookie) => {
  //   try {
  //     const decodedToken = jwt.decode(cookie);
  //     const redisCli = this.redisClient;

  //     const refreshToken = await redisCli.get(`userId:${decodedToken.userId}`);
  //     console.log('=== account refresh 레디스 연결 종료 ===');
  //     // 레디스 클라이언트 해제
  //     this.redisClient.quit();
  //     return refreshToken;
  //   } catch (error) {
  //     console.error('리프레시 토큰이 레디스에 존재하지 않음', error);
  //     return null;
  //   }
  // };

  generateAccessToken = (user) => {
    const accessToken = jwt.sign({ userId: user.userId }, env.ACCESS_KEY, {
      expiresIn: '10m',
    });
    return accessToken;
  };

  isAdmin = async (req, res, next) => {
    try {
      const header = req.headers.cookie;
      let accessToken;
      if (header) {
        const tokenParts = header.split(' ');
        if (tokenParts.length === 2 && tokenParts[0] === 'Authorization=Bearer') {
          accessToken = tokenParts[1];
        }
      }

      if (!accessToken) {
        return res.status(503).json({ message: '토큰이 존재하지 않습니다.' });
      }

      const decodedToken = jwt.decode(accessToken);

      console.log('🚀 ~ file: account.middleware.js:75 ~ AuthenticationMiddleware ~ isAdmin= ~ decodedToken:', decodedToken);
      // console.log(this.authRepository.isAdmin(decodedToken.userId));
      const isAdmin = await this.authRepository.isAdmin(decodedToken.userId);
      if (Boolean(isAdmin) === true) {
        next();
      } else {
        res.status(403).json({ message: '권한이 필요합니다.' });
      }
    } catch (error) {
      console.error('어드민 검증 오류:', error);
      res.status(500).json({ message: error.message });
    }
  };

  authenticateAccessToken = async (req, res, next) => {
    try {
      const header = req.headers.cookie;
      let accessToken;
      if (header) {
        const tokenParts = header.split(' ');
        if (tokenParts.length === 2 && tokenParts[0] === 'Authorization=Bearer') {
          accessToken = tokenParts[1];
        }
      }

      res.locals.accessToken = accessToken;

      const verifiedToken = jwt.verify(accessToken, env.ACCESS_KEY);

      // 유효한 액세스 토큰이라면 다음 미들웨어나 API 실행
      req.user = { id: verifiedToken.userId }; // 사용자 "아이디"를 req.user 객체에 저장

      const redisCli = this.redisClient;

      const refreshToken = await redisCli.get(`userId:${req.user.id}`);

      // console.log('=== account access 레디스 연결 종료 ===');

      // // 레디스 클라이언트 해제
      // this.redisClient.quit();

      if (refreshToken === null) {
        return res.status(401).json({ message: '토큰이 만료되었습니다.' });
      }

      next();
    } catch (error) {
      // 액세스 토큰이 만료되었을 경우, 리프레시 토큰 검증 미들웨어로 이동
      if (error.name === 'TokenExpiredError') {
        const decodedToken = jwt.decode(res.locals.accessToken);
        req.user = { id: decodedToken.userId };
        return this.authenticateRefreshToken(req, res, next);
      }
      // 액세스 토큰의 오류라면 오류 메세지
      return res.status(401).json({ message: '액세스 토큰 오류' });
    }
  };

  authenticateRefreshToken = async (req, res, next) => {
    try {
      const redisCli = this.redisClient;

      const refreshToken = await redisCli.get(`userId:${req.user.id}`);

      // console.log('=== account refresh 레디스 연결 종료 ===');

      // // 레디스 클라이언트 해제
      // this.redisClient.quit();

      if (!refreshToken) {
        return res.status(401).json({ message: '토큰이 만료되었습니다.' });
      }

      const verifiedToken = jwt.verify(refreshToken, env.REFRESH_KEY);

      // 유효한 리프레시 토큰인 경우, 새로운 액세스 토큰 발급
      const newAccessToken = this.generateAccessToken({ userId: verifiedToken.userId });
      res.setHeader('Authorization', `Bearer ${newAccessToken}`);
      req.user = { id: verifiedToken.userId }; // 사용자 "아이디"를 req.user 객체에 저장
      next();
    } catch (error) {
      // 리프레시 토큰 만료에러처리는 레디스에서 만료일자에 자동적으로 삭제하기 때문에 주석처리함
      // if (error.name === 'TokenExpiredError') {
      //   return res.status(401).json({ message: '리프레시 토큰 만료' });
      // }
      return res.status(401).json({ message: '리프레시 토큰 오류' });
    }
  };
}

module.exports = AuthenticationMiddleware;
