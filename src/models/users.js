'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Posts 모델과 1:N
      this.hasMany(models.Posts, {
        sourceKey: 'id',
        foreignKey: 'user_id',
      });
      // Comments 모델과 1:N
      this.hasMany(models.Comments, {
        sourceKey: 'id',
        foreignKey: 'user_id',
      });
      // Likes 모델과 1:N
      this.hasMany(models.Likes, {
        sourceKey: 'id',
        foreignKey: 'user_id',
      });
      // BannedUsers 모델과 1:N
      this.hasMany(models.BannedUsers, {
        sourceKey: 'id',
        foreignKey: 'user_id',
      });
      // Reports 모델과 1:N
      this.hasMany(models.Reports, {
        sourceKey: 'id',
        foreignKey: 'user_id',
      });
      // Followers 모델과 1:N
      this.hasMany(models.Followers, {
        sourceKey: 'id',
        foreignKey: 'user_id',
      });
      // AdminNotices 모델과 1:N
      this.hasMany(models.AdminNotices, {
        sourceKey: 'id',
        foreignKey: 'user_id',
      });
    }
  }
  Users.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
      },
      nickname: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      introduction: {
        type: DataTypes.STRING,
      },
      user_img: {
        defaultValue: 'https://cdn.vectorstock.com/i/preview-1x/32/12/default-avatar-profile-icon-vector-39013212.jpg',
        type: DataTypes.STRING,
      },
      deleted_at: {
        defaultValue: null,
        type: DataTypes.DATE,
      },
      is_admin: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
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
      modelName: 'Users',
    },
  );
  return Users;
};
