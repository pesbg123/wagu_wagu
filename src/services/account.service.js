const redisClient = require('../middlewares/redis.middleware');
const AccountRepository = require('../repositories/account.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });
const env = process.env;

class AccountService {
  constructor() {
    this.accountRepository = new AccountRepository();
  }

  generateAccessToken = (user) => {
    const accessToken = jwt.sign({ userId: user.id }, env.ACCESS_KEY, {
      expiresIn: '60m',
    });
    return accessToken;
  };

  generateRefreshToken = (user) => {
    const refreshToken = jwt.sign({ userId: user.id }, env.REFRESH_KEY, {
      expiresIn: '1d',
    });
    return refreshToken;
  };

  signUp = async (email, password) => {
    try {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

      // 이메일 형식 검사
      if (!emailRegex.test(email)) {
        throw { errorCode: 400, message: '올바른 이메일 형식이 아닙니다.' };
      }

      // 비밀번호 길이 검사
      if (password.length < 5) {
        throw { errorCode: 400, message: '비밀번호는 5글자 이상이어야 합니다.' };
      }

      const existUser = await this.accountRepository.findUserByEmail(email);

      if (existUser) {
        throw { errorCode: 400, message: '이미 존재하는 유저아이디.' };
      }

      if (!email || !password) {
        throw { errorCode: 412, message: '데이터를 모두 입력해야 됨.' };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await this.accountRepository.createUser(email, hashedPassword);

      return { message: '회원가입 성공' };
    } catch (error) {
      throw error;
    }
  };

  logIn = async (email, password) => {
    try {
      const user = await this.accountRepository.findUserByEmail(email);

      if (!user) {
        throw { errorCode: 404, message: '존재하지 않는 유저아이디.' };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw { errorCode: 401, message: '비밀번호가 일치하지 않습니다.' };
      }

      const isAdmin = this.accountRepository.isAdmin(user.id);

      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      console.log('🚀 ~ file: account.service.js:80 ~ AccountService ~ logIn= ~ refreshToken:', refreshToken);

      // redisClient.connect();

      // 데이터를 Redis에 저장하고 만료 시간을 설정
      await redisClient.v4.set(`userId:${user.id.toString()}`, refreshToken, 'EX', 24 * 60 * 60);

      const redisValue = await redisClient.v4.get(`userId:${user.id.toString()}`);

      console.log(`추가된 유저키와 리프레시 값 : ${user.id}, ${redisValue}`);

      return { accessToken, refreshToken, isAdmin };
    } catch (error) {
      throw error;
    }
  };

  logOut = async (accessToken) => {
    try {
      const decodedAccessToken = jwt.verify(accessToken, env.ACCESS_KEY);

      // console.log(decodedAccessToken.userId);

      const user = await this.accountRepository.findUserByUserId(decodedAccessToken.userId);

      if (!user) {
        throw { errorCode: 404, message: '존재하지 않는 유저아이디.' };
      }

      // 토큰 존재 확인
      const redisKEY = await redisClient.v4.exists(`userId:${user.id}`);

      if (!redisKEY) {
        throw { errorCode: 401, message: '리프레시 토큰이 존재하지 않음' };
      }

      const redisDEL = await redisClient.v4.del(`userId:${user.id}`);

      if (redisDEL) {
        console.log('토큰 삭제 성공');
      } else {
        throw { errorCode: 401, message: '토큰 삭제 오류' };
      }
    } catch (error) {
      throw error;
    }
  };

  getProfile = async (id) => {
    try {
      const user = await this.accountRepository.findUserByUserId(id);

      if (!user) {
        throw { errorCode: 404, message: '존재하지 않는 유저아이디.' };
      }

      return user;
    } catch (error) {
      throw error;
    }
  };

  updateNickname = async (id, nickname) => {
    try {
      await this.accountRepository.updateNickname(id, nickname);
      return;
    } catch (error) {
      throw error;
    }
  };

  updateIntroduction = async (id, introduction) => {
    try {
      await this.accountRepository.updateIntroduction(id, introduction);
      return;
    } catch (error) {
      throw error;
    }
  };

  updateUserImg = async (id, userImage) => {
    try {
      await this.accountRepository.updateUserImg(id, userImage);
      return;
    } catch (error) {
      throw error;
    }
  };

  updatePassword = async (id, currentPw, newPw) => {
    try {
      const user = await this.accountRepository.findUserByUserId(id);

      if (!user) {
        throw { errorCode: 404, message: '존재하지 않는 유저아이디.' };
      }

      const isPasswordValid = await bcrypt.compare(currentPw, user.password);

      if (!isPasswordValid) {
        throw { errorCode: 401, message: '비밀번호가 일치하지 않습니다.' };
      }

      const hashedPassword = await bcrypt.hash(newPw, 10);

      await this.accountRepository.updatePassword(id, hashedPassword);

      // 토큰 존재 확인
      const redisKEY = await redisClient.v4.exists(`userId:${user.id}`);

      if (!redisKEY) {
        throw { errorCode: 401, message: '리프레시 토큰이 존재하지 않음' };
      }

      const redisDEL = await redisClient.v4.del(`userId:${user.id}`);

      if (redisDEL) {
        console.log('토큰 삭제 성공');
      } else {
        throw { errorCode: 401, message: '토큰 삭제 오류' };
      }
      return;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = AccountService;
