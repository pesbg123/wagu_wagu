// const axios = require('axios');
// const cheerio = require('cheerio');
// const cron = require('node-cron');
// const sqlite3 = require('sqlite3').verbose();
// const path = require('path');
// const { CrawledRecipes } = require('../models');

// // HTML 가져오기 함수
// const getHTML = async (url) => {
//   try {
//     const response = await axios.get(url);
//     return response.data;
//   } catch (error) {
//     console.error(error);
//   }
// };

// // 크롤링 및 DB 저장 함수
// const crawlAndSaveData = async () => {
//   try {
//     const keyword = '레시피';
//     const totalPages = 1;

//     for (let page = 1; page <= totalPages; page++) {
//       setTimeout(async function () {
//         const url = `https://www.10000recipe.com/issue/view.html?cid=9999scrap&types=${encodeURI(keyword)}&page=${page}`;
//         const html = await getHTML(url);

//         const $ = cheerio.load(html);

//         let $courseListElms = $('.theme_list.st2');

//         $courseListElms.each(async (idx, node) => {
//           let promisesArray = [];

//           const recipeLinkElms = $(node).find('.thumbnail');

//           recipeLinkElms.each((idx, el) => {
//             promisesArray.push(
//               new Promise(async (resolve, reject) => {
//                 try {
//                   const recipeLinkAttr = $(el).attr('href');

//                   if (recipeLinkAttr) {
//                     const recipeUrl = 'https://www.10000recipe.com/' + recipeLinkAttr;
//                     const recipeHtml = await getHTML(recipeUrl);
//                     const recipe$ = cheerio.load(recipeHtml);

//                     let recipeTitle = '';
//                     $('.view2_summary h3').each((index, element) => {
//                       // 제목 추출
//                       recipeTitle += $(element).text().trim();
//                     });

//                     let recipeContent = '';
//                     $('.view2_summary .view2_summary_in').each((index, element) => {
//                       // 내용 추출
//                       recipeContent += $(element).text().trim();
//                     });

//                     let view_step_cont = '';
//                     $('.view_step_cont.media').each((index, element) => {
//                       // 준비 단계 설명 추출
//                       view_step_cont += $(element).text().trim();
//                     });

//                     CrawledRecipes.create({ recipe_title: recipeTitle, recipe_content: recipeContent, view_step_cont });
//                     // var query = `INSERT INTO recipes(title,content,view_step_cont)
//                     //           VALUES(?,?,?)`;

//                     // //데이터 삽입
//                     // db.run(query, [recipeTitle.trim(), recipeContent.trim(), view_step_cont.trim()], function (err) {
//                     //   if (err) {
//                     //     reject(`Error inserting data:${err.message}`);
//                     //   } else {
//                     //     console.log(`Recipe saved to database:${this.lastID}`);
//                     //     resolve();
//                     //   }
//                     // });
//                   }
//                 } catch (error) {
//                   reject(error);
//                 }
//               }),
//             );
//           });

//           // 모든 비동기 작업이 완료될 때까지 기다림
//           await Promise.all(promisesArray);
//         });
//       }, 5000 * page);
//     }

//     console.log(`크롤링 및 DB 저장 완료`);
//   } catch (error) {
//     console.error(error);
//   }
// };

// // cron.schedule(
// //   '0 3 * * *',
// //   () => {
// //     console.log('Running a job at 03:00 at America/Sao_Paulo timezone');
// //   },
// //   {
// //     scheduled: true,
// //     timezone: 'America/Sao_Paulo',
// //   },
// // );
