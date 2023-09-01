$(document).ready(() => {
  getPosts();
});

const getPosts = async () => {
  try {
    const response = await axios.get('/api/posts');
    const posts = response.data.data;

    let allHtml = '';
    posts.forEach((item) => {
      let tempHtml = `
        <div class="col-md-4 mb-4">
          <div class="card shadow-sm">
            <img src="${item.food_img}" alt="${item.title}" class="card-img-top">
            <div class="card-body">
              <p class="card-text">${item.title}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button type="button" class="btn btn-sm btn-outline-secondary">기본</button>
                  <button type="button" class="btn btn-sm btn-outline-secondary">기본</button>
                </div>
                <small class="text-body-secondary">${item.createdAt}</small>
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
          const card = document.createElement('div');
          card.classList.add('col-md-4', 'mb-4');
          card.innerHTML = `
            <div class="card shadow-sm">
              <img src="${row.food_img}" alt="${row.title}" class="card-img-top">
              <div class="card-body">
                <p class="card-text">${row.title}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-secondary">무한</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary">무한</button>
                  </div>
                  <small class="text-body-secondary">${row.createdAt}</small>
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

const form = document.querySelector('#postForm');
form.addEventListener('submit', post);
