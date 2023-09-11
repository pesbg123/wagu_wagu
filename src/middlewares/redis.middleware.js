const redis = require('redis');
require('dotenv').config({ path: '../.env' });
const env = process.env;

// 레디스 클라이언트 생성
const redisClient = redis.createClient({
  url: env.REDIS_URL,
  legacyMode: true,
});

redisClient.on('connect', () => {
  console.log('Redis 연결 성공');
});

// Redis 클라이언트 해제
redisClient.on('end', () => {
  console.log('Redis 연결 해제');
});

redisClient.on('error', (error) => {
  console.error('Redis 연결 오류:', error);
});

module.exports = redisClient;
