$(document).ready(() => {
  getPosts();
});

const getPosts = async () => {
  try {
    const response = await axios.get('/api/posts');
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

    pageCount++;
    const lastCard = document.querySelector('#card-list > .col-md-4:last-child');
    io.observe(lastCard);
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
  entries.forEach(async (entry) => {
    if (entry.isIntersecting) {
      pageCount++;
      try {
        const response = await axios.get(`/api/posts?page=${pageCount}`);
        const rows = response.data.data;

        const cardList = document.getElementById('card-list');

        rows.forEach((row) => {
          const createdAt = convertToKST(row.created_at);
          const card = document.createElement('div');
          card.classList.add('col-md-4', 'mb-4');
          card.innerHTML = `
            <div class="card shadow-sm">
              <img src="${row.food_img}" alt="${row.title}" class="card-img-top">
              <div class="card-body">
                <p class="card-text">${row.title}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                  <p>${row['User.nickname']}</p>
                  </div>
                  <small class="text-body-secondary">${createdAt}</small>
                </div>
              </div>
            </div>
          `;
          cardList.appendChild(card);
        });

        const lastCard = cardList.querySelector('.col-md-4:last-child');
        io.observe(lastCard);
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
      }
    }
  });
});

// 공지 1
$('#site-introduction').click(() => {
  location.href = '/notice/24';
});

// 공지 2
$('#site-rule').click(() => {
  location.href = '/notice/25';
});
