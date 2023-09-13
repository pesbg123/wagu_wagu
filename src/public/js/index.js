$(document).ready(() => {
  getPosts(1);
  getHashtag();
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

let pageCount = 12;
const io = new IntersectionObserver(async (entries, observer) => {
  entries.forEach(
    async (entry) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        pageCount++;
        getPosts(pageCount);
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

const getHashtag = async () => {
  try {
    const response = await fetch('/api/hashtags', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      const tags = data.map((item) => item.hashtag);
      localStorage.setItem('tags', JSON.stringify(tags));
    } else {
      const data = await response.json();
      console.error('Error:', data.errorMessage);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const searchInput = document.querySelector('.search-input');
const searchBox = document.querySelector('.search-box');

searchInput.addEventListener('input', () => {
  const userInput = searchInput.value.trim(); // 입력한 검색어
  searchBox.innerHTML = ''; // 이전 추천 검색어 초기화

  if (userInput.startsWith('#')) {
    // 입력한 검색어가 '#'으로 시작하는 경우에만 추천 검색어를 표시
    const recommendedKeywords = JSON.parse(localStorage.getItem('tags'));

    recommendedKeywords.forEach((keyword) => {
      const li = document.createElement('li');
      li.textContent = keyword;

      // 사용자가 입력한 검색어 부분만 볼드 처리
      if (keyword.toLowerCase().includes(userInput.toLowerCase().substring(1))) {
        const index = keyword.toLowerCase().indexOf(userInput.toLowerCase().substring(1));
        const matchedPart = keyword.substring(index, index + userInput.length - 1);
        const restPart = keyword.substring(index + userInput.length - 1);
        li.innerHTML = `<span class="user-input">${userInput}</span>${restPart}`;
      }

      searchBox.appendChild(li);
    });

    // 추천 검색어가 있을 때만 검색 박스를 표시
    if (recommendedKeywords.length > 0) {
      searchBox.style.display = 'block';
    } else {
      searchBox.style.display = 'none';
    }
  } else {
    searchBox.style.display = 'none'; // 검색어가 '#'으로 시작하지 않으면 검색 박스를 숨김
  }
});

// 검색어 입력창 밖을 클릭하면 검색 박스를 숨김
document.addEventListener('click', (event) => {
  if (!searchInput.contains(event.target) && !searchBox.contains(event.target)) {
    searchBox.style.display = 'none';
  }
});
