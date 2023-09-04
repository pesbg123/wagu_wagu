// const AuthenticationMiddleware = require('./account.middleware');
// const AccountRepository = require('../repositories/account.repository');

// require('dotenv').config();
// const env = process.env;

// const authenticateToken = async (req, res, next) => {
//   if (req.headers.cookie) {
//     try {
//       console.log('index.html 진입');
//       const authHeader = req.headers.cookies['authorization'];
//       let accessToken;

//       if (authHeader) {
//         const tokenParts = authHeader.split(' ');
//         if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
//           accessToken = tokenParts[1];
//         }
//       }

//       const authMiddleware = new AuthenticationMiddleware();

//       const refreshToken = await authMiddleware.getRefreshToken(accessToken);

//       if (!refreshToken) {
//         // 리프레시 토큰이 없을 때의 동작을 수행
//         console.log('리프레시 토큰이 없습니다.');
//         return next(); // 다음 미들웨어로 이동
//       }

//       authMiddleware.authenticateAccessToken(req, res, () => {
//         // 액세스 토큰 검증에 성공한 경우, 마이페이지로 리다이렉트

//         return res.redirect('/html/mypage.html');
//       });
//     } catch (error) {
//       return res.status(401).json({ message: '액세스 토큰 오류' });
//     }
//   } else {
//     next();
//   }
// };

// // class indexMiddleware {
// //   constructor() {
// //     this.authenticationMiddleware = new AuthenticationMiddleware();

// //     // 레디스 클라이언트를 생성하고 인스턴스 변수에 저장
// //     this.redisClient = redis.createClient({
// //       url: env.REDIS_URL,
// //       legacyMode: true,
// //     });

// //     this.redisClient.on('connect', () => {
// //       console.log('=== index 레디스 연결 성공 ===');
// //     });

// //     this.redisClient.on('error', (error) => {
// //       throw { errorCode: 500, message: error };
// //     });

// //     this.redisClient.connect();
// //   }

// //   indexToken = async (req, res, next) => {
// //     console.log(1111);
// //     console.log(req.headers.cookie);
// //     const authHeader = req.headers.cookie['accessToken'];
// //     console.log(authHeader);
// //     let accessToken;

// //     if (authHeader) {
// //       console.log(1);
// //       const tokenParts = authHeader.split(' ');
// //       if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
// //         accessToken = tokenParts[1];
// //       }

// //       const redisCli = this.redisClient;

// //       const refreshToken = await redisCli.get(`userId:${req.user.id}`);

// //       console.log('=== index 레디스 연결 종료 ===');

// //       this.redisClient.quit();

// //       if (!refreshToken) {
// //         res.setHeader('Authorization', '');
// //         return next();
// //       }

// //       this.authenticationMiddleware.authenticateAccessToken(req, res, () => {
// //         return res.json({ message: '토큰이 모두 유효한 사용자' });
// //       });
// //     } else {
// //       next();
// //     }
// //   };
// // }

// module.exports = indexMiddleware;
