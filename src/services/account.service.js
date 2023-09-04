const AccountRepository = require('../repositories/account.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redis = require('redis');

require('dotenv').config({ path: '../.env' });
const env = process.env;

class AccountService {
  constructor() {
    this.authRepository = new AccountRepository();
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
    const existUser = await this.authRepository.findUserByEmail(email);

    if (existUser) {
      throw { errorCode: 400, message: '이미 존재하는 유저아이디.' };
    }

    if (!email || !password) {
      throw { errorCode: 412, message: '데이터를 모두 입력해야 됨.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.authRepository.createUser(email, hashedPassword);
  };

  logIn = async (email, password) => {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw { errorCode: 404, message: '존재하지 않는 유저아이디.' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw { errorCode: 401, message: '비밀번호가 일치하지 않습니다.' };
    }

    const isAdmin = this.authRepository.isAdmin(user.id);

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

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

    // Redis에 토큰 저장
    await redisCli.set(`userId:${user.id.toString()}`, refreshToken);
    // 리프레시 토큰 만료 일자랑 동일한 시기에 레디스에서 자동 삭제
    await redisCli.expire(`userId:${user.id.toString()}`, 24 * 60 * 60);

    const redisValue = await redisCli.get(`userId:${user.id}`);

    console.log(`추가된 유저키와 리프레시 값 : ${redisValue}`);

    console.log('===레디스 연결 종료===');

    await redisClient.v4.quit();

    return { accessToken, refreshToken, isAdmin };
  };

  logOut = async (accessToken) => {
    const decodedAccessToken = jwt.verify(accessToken, env.ACCESS_KEY);

    console.log(decodedAccessToken.userId);

    const user = await this.authRepository.findUserByUserId(decodedAccessToken.userId);

    if (!user) {
      throw { errorCode: 404, message: '존재하지 않는 유저아이디.' };
    }

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

    // 토큰 존재 확인
    const redisKEY = await redisCli.exists(`userId:${user.id}`);

    if (!redisKEY) {
      throw { errorCode: 401, message: '리프레시 토큰이 존재하지 않음' };
    }

    const redisDEL = await redisCli.del(`userId:${user.id}`);

    if (redisDEL) {
      console.log('토큰 삭제 성공');
    } else {
      throw { errorCode: 401, message: '토큰 삭제 오류' };
    }

    console.log('===레디스 연결 종료===');

    await redisClient.v4.quit();
  };
}

module.exports = AccountService;
