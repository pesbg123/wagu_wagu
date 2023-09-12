/* eslint-disable no-undef */
let postId;

const headers = {
  headers: {
    'Content-Type': 'application/json',
    authorization: `${getCookie('WGID')}`,
  },
};

$(document).ready(() => {
  const url = new URL(window.location.href);
  postId = url.pathname.split('/')[2];
  getPost();
});

// 한국 시간으로 변환하는 함수
const convertToKST = (dateUTCString) => {
  const dateUTC = new Date(dateUTCString);
  return dateUTC.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
};

const getUserInfo = async () => {
  const response = await axios.get('http://localhost:3000/api/user', headers);
  if (!response) return null;
  return response.data;
};

const getPost = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/posts/${postId}`, headers);
    const createdAt = convertToKST(response.data.data.created_at);
    let food_img = response.data.data.food_img;
    let user_img = response.data.data['Comments.User.user_img'];

    if (!response.data.data.food_img) food_img = 'https://dummyimage.com/900x400/ced4da/6c757d.jpg';
    if (!response.data.data.food_img) user_img = 'https://dummyimage.com/50x50/ced4da/6c757d.jpg';

    const tempHtml = `<!-- Post header-->
                        <header class="mb-4">
                          <!-- Post title-->
                          <h1 class="fw-bolder mb-2">${response.data.data.title}</h1>
                          <!-- Post meta content-->
                          <div class="text-muted fst-italic mb-2">
                          ${createdAt}
                          </div>
                          <!-- Btn container -->
                          <div>
                            <button style="border: none; post-id="${response.data.data.id}"  margin-bottom: 5px;">신고</button>
                            <button style="border: none; post-id="${response.data.data.id}"  margin-bottom: 5px;">수정</button>
                            <button style="border: none; post-id="${response.data.data.id}" margin-bottom: 5px;">삭제</button>
                          </div>
                          <!-- Post categories-->
                          <a class="badge bg-info text-decoration-none link-light" href="#!">해시테그가 들어갑니다.</a>
                          <a class="badge bg-success text-decoration-none link-light" href="#!">해시테그가 들어갑니다.</a>
                        </header>
                        <!-- Preview image figure-->
                        <figure class="mb-4"><img class="img-fluid rounded" src="${food_img}"
                            alt="..." /></figure>
                        <!-- Post content-->
                        <section class="mb-5">
                          <h2 class="fw-bolder mb-4 mt-5">준비 재료</h2>
                          <p class="fs-5 mb-4">${response.data.data.ingredient}</p>
                          <h2 class="fw-bolder mb-4 mt-5">레시피</h2>
                          <p class="fs-5 mb-4">${response.data.data.recipe}</p>
                        </section>`;

    $('.one-post').html(tempHtml);
  } catch (error) {
    console.log(error);
  }
};

//쿠키에서 특정 이름의 쿠키 값을 가져오는 함수
function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName.trim() === name) {
      return cookieValue;
    }
  }
  return null;
}
