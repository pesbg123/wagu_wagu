const { faker } = require('@faker-js/faker');
const { Users } = require('../models');

const createAndSaveUser = async () => {
  // 페이커로 생성한 더미 데이터
  const randomEmail = faker.internet.email();
  const randomNickname = faker.internet.userName();
  const randomPassword = faker.internet.password();

  console.log(randomEmail);
  console.log(randomNickname);
  console.log(randomPassword);

  try {
    // 시퀄라이즈 모델을 사용하여 데이터베이스에 저장
    const newUser = await Users.create({
      email: randomEmail,
      nickname: randomNickname,
      password: randomPassword,
    });
    console.log('User saved to the database:', newUser.toJSON());
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

createAndSaveUser();
