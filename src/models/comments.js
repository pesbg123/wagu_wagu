'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
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
      // Reports 모델과 1:N
      this.hasMany(models.Reports, {
        sourceKey: 'id',
        foreignKey: 'comment_id',
      });
    }
  }
  Comments.init(
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
      reply_id: {
        defaultValue: null,
        type: DataTypes.INTEGER,
      },
      content: {
        allowNull: false,
        type: DataTypes.STRING,
      }, // 신고 횟수 컬럼 추가
      report_count: {
        defaultValue: 0,
        type: DataTypes.INTEGER,
      },
      is_blocked: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      deleted_at: {
        defaultValue: false,
        type: DataTypes.DATE,
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
      paranoid: true,
      modelName: 'Comments',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    },
  );
  return Comments;
};
