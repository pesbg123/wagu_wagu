'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Posts 모델과 N:1
      this.belongsTo(models.Users, {
        targetKey: 'id',
        foreignKey: 'user_id',
      });
      // Comments 모델과 1:N
      this.hasMany(models.Comments, {
        sourceKey: 'id',
        foreignKey: 'post_id',
      });
      // PostHashtags 모델과 1:N
      this.hasMany(models.PostHashtags, {
        sourceKey: 'id',
        foreignKey: 'post_id',
      });
      // Reports 모델과 1:N
      this.hasMany(models.Reports, {
        sourceKey: 'id',
        foreignKey: 'post_id',
      });
      // PostLikes 모델과 1:N
      this.hasMany(models.PostLikes, {
        sourceKey: 'id',
        foreignKey: 'post_id',
      });
    }
  }
  Posts.init(
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
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      ingredient: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      recipe: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      food_img: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      like: {
        defaultValue: 0,
        type: DataTypes.BIGINT,
      },
      is_blocked: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      deleted_at: {
        defaultValue: null,
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
      modelName: 'Posts',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
  return Posts;
};
