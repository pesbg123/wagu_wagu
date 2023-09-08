'use strict';

const { faker } = require('@faker-js/faker');
const { Users } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 더미 데이터 생성 및 데이터베이스에 저장
    const createAndSaveUser = async () => {
      const randomEmail = faker.internet.email();
      const randomNickname = faker.internet.userName();
      const randomPassword = faker.internet.password();

      try {
        await Users.create({
          email: randomEmail,
          nickname: randomNickname,
          password: randomPassword,
        });
        console.log('User saved to the database');
      } catch (error) {
        console.error('Error saving user:', error);
      }
    };

    // 더미 데이터 추가 예시: 5개의 더미 사용자 생성
    for (let i = 0; i < 5; i++) {
      await createAndSaveUser();
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
