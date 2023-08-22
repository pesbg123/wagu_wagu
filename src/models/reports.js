'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Users 모델과 N:1
      this.belongsTo(models.Users, {
        targetKey: 'id',
        foreignKey: 'user_id',
      });
      // Posts 모델과 N:1
      this.belongsTo(models.Posts, {
        targetKey: 'id',
        foreignKey: 'post_id',
      });
      // Comments 모델과 N:1
      this.belongsTo(models.Comments, {
        targetKey: 'id',
        foreignKey: 'comment_id',
      });
    }
  }
  Reports.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      post_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Posts',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      comment_id: {
        defaultValue: null,
        type: DataTypes.INTEGER,
        references: {
          model: 'Comments',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      reported_reason: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      reported_count: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Reports',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
  return Reports;
};
