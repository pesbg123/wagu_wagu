$(document).ready(() => {
  getPosts();
});
const getPosts = async () => {
  try {
    const response = await axios.get('/api/posts');
    console.log(response);
    let allHtml = '';
    response.data.data.forEach((item) => {
      let tempHtml = `<div class="col"> <div class="card shadow-sm">
      <svg class="bd-placeholder-img card-img-top" width="20000%" height="225" 
            
              <img src="${item.food_img}" alt="${item.title}" class="card-img-top">
              <div class="card-body">
                <p class="card-text">${item.title}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-secondary">ㅎ</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary">ㅇ</button>
                  </div>
                  <small class="text-body-secondary">9분</small>
                </div>
              </div>
            </div>
          </div>`;
      allHtml += tempHtml;
    });

    $('#card-list').html(allHtml);

    const lastLi = document.querySelector('.feed-container > li:last-child');
    io.observe(lastLi);
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
        const rows = response.data;

        const feedList = document.getElementById('feedList');

        rows.forEach((row) => {
          const feedItem = document.createElement('li');
          feedItem.classList.add('feed-item');
          feedItem.innerHTML = `
            <a href="/detail/${row.post}">
              <div class="img-container">
                <img src="${row.imageUrl}" style="border-radius: 10px;" />
              </div>
              <h3>${row.name}</h3>
              <p style="color:gray;">${row.foodType}</p>
            </a>
          `;
          feedList.appendChild(feedItem);
        });

        const lastLi = feedList.querySelector('.feed-item:last-child');
        io.observe(lastLi);
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
      }
    }
  });
});

const form = document.querySelector('#postForm');
form.addEventListener('submit', post);

