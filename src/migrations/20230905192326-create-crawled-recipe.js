'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CrawledRecipes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      recipe_title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      recipe_content: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      view_step_cont: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      like: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.BIGINT,
      },
      recipe_img: {
        allowNull: false,
        defaultValue: 'https://trade.cnu.ac.kr/_custom/cnu/resource/img/tmp_gallery.png',
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CrawledRecipes');
  },
};
