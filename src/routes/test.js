const axios = require('axios');
const cheerio = require('cheerio');

const getHTML = async (keyword, page) => {
  console.log('--------------------------------------');
  console.log(page);

  try {
    const response = await axios.get('https://www.10000recipe.com/issue/view.html?cid=10000mag&types=' + encodeURI(keyword) + `&page=${page}`);
    return response.data; // response.data로 실제 HTML 데이터 추출
  } catch (error) {
    console.log(error);
  }
};

// const getDetail = async (recipeNum) => {
//   console.log('--------------------------------------');
//   console.log(`https://www.10000recipe.com/recipe/${recipeNum}`);
//   console.log('--------------------------------------');
//   try {
//     const response = await axios.get(`https://www.10000recipe.com/recipe/${recipeNum}`);
//     return response.data; // response.data로 실제 HTML 데이터 추출
//   } catch (error) {
//     console.log(error);
//   }
// };

// const init = async () => {
//   const result = await getDetail(6988334);
//   console.log(result);
// };

// init();

const parsing = async (keyword, page) => {
  const html = await getHTML(keyword, page);

  const $ = cheerio.load(html);
  const $courseList = $('.theme_list.st2');
  //   console.log('$courseList', $courseList);

  let $courses = [];
  $courseList.each((idx, node) => {
    const title = $(node).find('.thumbnail');
    console.log('title', title);
  });
};

// const totalPages = 1;
// for (let page = 1; page <= totalPages; page++) {
//   setTimeout(function () {
//     parsing('레시피', page);
//   }, 5000 * page);
// }
