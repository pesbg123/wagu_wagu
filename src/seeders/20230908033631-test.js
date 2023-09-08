'use strict';

const { faker } = require('@faker-js/faker');
const { Users, Posts } = require('../models');

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

    const createAndSavePost = async () => {
      const randomUserId = faker.helpers.rangeToNumber({ min: 15, max: 20000 });
      const randomTitle = faker.commerce.productName();
      const randomIngredient = faker.commerce.productMaterial();
      const randomRecipe = faker.lorem.text();
      const img = 'https://waguwagu-s3.s3.ap-northeast-2.amazonaws.com/food_img/1693989353830_food_img.png';

      try {
        await Posts.create({
          user_id: randomUserId,
          title: randomTitle,
          ingredient: randomIngredient,
          recipe: randomRecipe,
          food_img: img,
        });
        console.log('Post saved to the database');
      } catch (error) {
        console.error('Error saving post:', error);
      }
    };

    // 더미 데이터 추가 예시: 5개의 더미 사용자 생성
    for (let i = 0; i < 20000; i++) {
      // await createAndSaveUser();
      await createAndSavePost();
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
