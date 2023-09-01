// const axios = require('axios');
// const cheerio = require('cheerio');

// const getHTML = async (url) => {
//   try {
//     const response = await axios.get(url);
//     return response.data;
//   } catch (error) {
//     console.error(error);
//   }
// };

// const parsing = async (keyword, page) => {
//   const url = `https://www.10000recipe.com/issue/view.html?cid=9999scrap&types=${encodeURI(keyword)}&page=${page}`;
//   const html = await getHTML(url);

//   const $ = cheerio.load(html);
//   let $courseList = $('.theme_list.st2');
//   // $courseList = $courseList.find('a');

//   //  $courseList.each((idx, el) => {
//   //   console.log($(el).html());
//   // });

//   $courseList.each(async (idx, node) => {
//     // console.log($(node).html(), idx);

//     // const recipeLink = $(node).find('.thumbnail').attr('href');
//     const recipeLink = $(node).find('.thumbnail');
//     // console.clear();
//     recipeLink.each(async (idx, el) => {
//       const recipeLink = $(el).attr('href');
//       if (recipeLink) {
//         const recipeUrl = `https://www.10000recipe.com/${recipeLink}`;
//         const recipeHtml = await getHTML(recipeUrl);
//         const recipe$ = cheerio.load(recipeHtml);

//         const recipeTitle = recipe$('.view2_summary h3').text();
//         console.log('Recipe Title:', recipeTitle.trim());

//         const recipeContent = recipe$('.view2_summary .view2_summary_in').text();
//         console.log('Recipe Content:', recipeContent.trim());

//         const view_step_cont = recipe$('.view_step_cont.media').text();
//         console.log('view_step_cont:', view_step_cont.trim());
//       }
//     });
//   });
// };

// const totalPages = 1;
// const keyword = '레시피';

// for (let page = 1; page <= totalPages; page++) {
//   setTimeout(function () {
//     parsing(keyword, page);
//   }, 1000 * page);
// }
