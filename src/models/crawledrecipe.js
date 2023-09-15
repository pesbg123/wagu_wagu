'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CrawledRecipes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CrawledRecipes.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    recipe_title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    recipe_content: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    view_step_cont: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    like: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.BIGINT,
    },
    recipe_img: {
      allowNull: false,
      defaultValue: 'https://trade.cnu.ac.kr/_custom/cnu/resource/img/tmp_gallery.png',
      type: DataTypes.STRING,
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
  }, {
    sequelize,
    modelName: 'CrawledRecipes',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return CrawledRecipes;
};