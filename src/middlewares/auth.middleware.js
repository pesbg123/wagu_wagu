// const jwt = require('jsonwebtoken');
// const env = process.env;
// const AccountRepository = require('../repositories/account.repository');

// const authenticateUser = (req, res, next) => {
//   const accessToken = req.headers.cookie.split(' ')[1];

//   jwt.decode(accessToken, () => {
//     const userId = decoded.userId;

//     const authRepository = new AccountRepository();

//     if (authRepository.isAdmin(userId) === true) {
//     }

//     next();
//   });
// };

// module.exports = authenticateUser;
