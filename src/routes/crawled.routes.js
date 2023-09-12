const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const { CrawledRecipes } = require('../models');
const { where } = require('sequelize');

const getHTML = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

module.exports = async (keyword, page) => {
  const url = `https://www.10000recipe.com/issue/view.html?cid=9999scrap&types=${encodeURI(keyword)}&page=${page}`;
  const html = await getHTML(url);

  const $ = cheerio.load(html);
  let $courseList = $('.theme_list.st2');

  $courseList.each(async (idx, node) => {
    const recipeLink = $(node).find('.thumbnail');

    recipeLink.each(async (idx, el) => {
      const recipeLink = $(el).attr('href');
      if (recipeLink) {
        const recipeUrl = `https://www.10000recipe.com/${recipeLink}`;
        const recipeHtml = await getHTML(recipeUrl);
        const recipe$ = cheerio.load(recipeHtml);

        const recipeTitle = recipe$('.view2_summary h3').text();
        console.log('Recipe Title:', recipeTitle.trim());

        const recipeContent = recipe$('.view2_summary .view2_summary_in').text();
        console.log('Recipe Content:', recipeContent.trim());

        const view_step_cont = recipe$('.view_step_cont.media').text();
        console.log('view_step_cont:', view_step_cont.trim());

        const findrecipe = CrawledRecipes.findAll({ where: { recipe_title: recipeTitle } });

        if (findrecipe.length > 0) {
          return;
        }

        CrawledRecipes.create({ recipe_title: recipeTitle, recipe_content: recipeContent, view_step_cont });
      }
    });
  });
};
