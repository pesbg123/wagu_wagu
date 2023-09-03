// const jwt = require('jsonwebtoken');
// const redis = require('redis');
// const AccountRepository = require('../repositories/account.repository');
// require('dotenv').config();
// const env = process.env;

// class isAdminMiddleware {
//   constructor() {
//     this.authRepository = new AccountRepository();
//   }

//   isAdmin(req, res, next) {
//     try {
//       const authHeader = req.headers['authorization'];
//       let accessToken;

//       if (authHeader) {
//         const tokenParts = authHeader.split(' ');
//         if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
//           accessToken = tokenParts[1];
//         }
//       }

//       if (!accessToken) {
//         return res.status(403).json({ message: '액세스 토큰이 필요합니다.' });
//       }

//       const verifiedToken = jwt.verify(accessToken, env.ACCESS_KEY);

//       if (this.authRepository.isAdmin(verifiedToken.userId) === true) {
//         next();
//       } else {
//         res.status(403).json({ message: '관리자 권한이 필요합니다.' });
//       }
//     } catch (error) {
//       res.status(401).json({ message: '액세스 토큰 오류' });
//     }
//   }
// }

// module.exports = isAdminMiddleware;
