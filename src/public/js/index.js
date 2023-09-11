$(document).ready(() => {
  getPosts(1);
});

const getPosts = async (page) => {
  try {
    const response = await axios.get(`/api/posts?page=${page}`);
    const posts = response.data.data;

    let allHtml = '';
    posts.forEach((item) => {
      const cretedAt = convertToKST(item.created_at);
      let tempHtml = `
        <div class="col-md-4 mb-4">
          <div class="card shadow-sm">
            <img src="${item.food_img}" alt="${item.title}" class="card-img-top">
            <div class="card-body">
              <p class="card-text">${item.title}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <p>${item.User.nickname}</p>
                </div>
                <small class="text-body-secondary">${cretedAt}</small>
                <span class="like-count">❤️ ${item.like} </span> 
              </div>
            </div>
          </div>
        </div>`;
      allHtml += tempHtml;
    });

    $('#card-list').append(allHtml);

    io.observe(document.querySelector('#card-list .col-md-4:last-child'));
  } catch (error) {
    console.log(error);
  }
};

// 한국 시간으로 변환하는 함수
const convertToKST = (dateUTCString) => {
  const dateUTC = new Date(dateUTCString);
  return dateUTC.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
};

let pageCount = 1;
const io = new IntersectionObserver(async (entries, observer) => {
  entries.forEach(
    async (entry) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        pageCount++;
        getPosts(pageCount); // 사용자가 페이지 하단에 도달하면 새로운 페이지의 게시물들을 불러옵니다.
      }
    },
    { threshold: [1] },
  );
});
// 공지 1
$('#site-introduction').click(() => {
  location.href = '/notice/24';
});

// 공지 2
$('#site-rule').click(() => {
  location.href = '/notice/25';
});
