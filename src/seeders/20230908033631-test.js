'use strict';

const { faker } = require('@faker-js/faker');
const { Users, Posts, PostHashtags } = require('../models');

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
      const imageUrls = [
        'https://waguwagu-s3.s3.ap-northeast-2.amazonaws.com/food_img/1694763080188_1.jpg',
        'https://waguwagu-s3.s3.ap-northeast-2.amazonaws.com/food_img/1694763206284_2.jpg',
        'https://waguwagu-s3.s3.ap-northeast-2.amazonaws.com/food_img/1694763316258_3.jpeg',
        'https://waguwagu-s3.s3.ap-northeast-2.amazonaws.com/food_img/1694763384569_4.jpg',
        'https://waguwagu-s3.s3.ap-northeast-2.amazonaws.com/food_img/1694763472514_5.jpg',
        'https://waguwagu-s3.s3.ap-northeast-2.amazonaws.com/food_img/1694763924273_6.jpg',
        'https://waguwagu-s3.s3.ap-northeast-2.amazonaws.com/food_img/1694763940601_7.jpg',
        'https://waguwagu-s3.s3.ap-northeast-2.amazonaws.com/food_img/1694763952137_8.jpg',
        'https://waguwagu-s3.s3.ap-northeast-2.amazonaws.com/food_img/1694763970407_9.jpg',
        'https://waguwagu-s3.s3.ap-northeast-2.amazonaws.com/food_img/1694764019288_10.jpg',
        'https://waguwagu-s3.s3.ap-northeast-2.amazonaws.com/food_img/1694764036763_11.png',
        'https://waguwagu-s3.s3.ap-northeast-2.amazonaws.com/food_img/1694764047000_12.jpg',
        'https://waguwagu-s3.s3.ap-northeast-2.amazonaws.com/food_img/1694764058413_13.jpg',
        'https://waguwagu-s3.s3.ap-northeast-2.amazonaws.com/food_img/1694764070518_14.jpg',
        'https://waguwagu-s3.s3.ap-northeast-2.amazonaws.com/food_img/1694764100216_15.jpg',
        'https://waguwagu-s3.s3.ap-northeast-2.amazonaws.com/food_img/1694764121550_16.jpg',
        'https://waguwagu-s3.s3.ap-northeast-2.amazonaws.com/food_img/1694764133233_17.jpg',
        'https://waguwagu-s3.s3.ap-northeast-2.amazonaws.com/food_img/1694764142823_18.jpg',
        'https://waguwagu-s3.s3.ap-northeast-2.amazonaws.com/food_img/1694764244760_19.jpg',
        'https://waguwagu-s3.s3.ap-northeast-2.amazonaws.com/food_img/1694764257502_20.jpg',
      ];

      const randomUserId = faker.helpers.rangeToNumber({ min: 1, max: 5001 });
      const randomTitle = faker.commerce.productName();
      const randomIngredient = faker.commerce.productMaterial();
      const randomRecipe = faker.lorem.text();
      const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];

      try {
        await Posts.create({
          user_id: randomUserId,
          title: randomTitle,
          ingredient: randomIngredient,
          recipe: randomRecipe,
          food_img: randomImageUrl,
        });
        console.log('Post saved to the database');
      } catch (error) {
        console.error('Error saving post:', error);
      }
    };

    let post_id = 23; // 시작 값
    const createAndSaveHashtag = async () => {
      const randomHashtagId = faker.helpers.rangeToNumber({ min: 5, max: 8 });

      try {
        await PostHashtags.create({
          post_id: post_id++, // post_id를 사용하고 증가시킴
          hashtag_id: randomHashtagId,
        });
        console.log('PostHashtag saved to the database');
      } catch (error) {
        console.error('데이터베이스 저장 중 오류 발생:', error);
      }
    };

    // 더미 데이터 추가 예시: 5개의 더미 사용자 생성
    for (let i = 0; i < 5000; i++) {
      // await createAndSaveUser();
      // await createAndSavePost();
      await createAndSaveHashtag();
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
