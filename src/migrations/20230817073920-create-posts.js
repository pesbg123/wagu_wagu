'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      ingredient: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      recipe: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      food_img: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      like: {
        defaultValue: 0,
        type: Sequelize.BIGINT,
      }, // 신고 횟수 컬럼 추가
      report_count: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      is_blocked: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      deleted_at: {
        defaultValue: null,
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Posts');
  },
};
