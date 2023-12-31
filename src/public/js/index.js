$(document).ready(() => {
  getPosts(1);
  getHashtag();
  getInitialCrawledData();
});

const getPosts = async (page) => {
  try {
    const response = await axios.get(`https://xyz.waguwagu.online/api/posts?page=${page}`);
    const posts = response.data.data;

    let allHtml = '';
    posts.forEach((item) => {
      const cretedAt = convertToKST(item.created_at);
      let tempHtml = `
        <div class="col-md-4 mb-4">
          <div class="card shadow-sm"></div>
            <img src="${item.food_img}" id="post-img-click" post-id="${item.id}" alt="${item.title}" class="card-img-top">
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

$(document).on('click', '#post-img-click', function () {
  location.href = `/food_page/${$(this).attr('post-id')}`;
});

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

      li.addEventListener('click', () => {
        // 해시태그를 클릭하면 해당 해시태그를 검색창에 표시
        searchInput.value = `#${keyword}`;
        searchBox.style.display = 'none'; // 추천 검색어 박스 숨기기
      });

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
// 검색 버튼 클릭 이벤트 처리
$('.search-button').click(() => {
  const userInput = $('.search-input').val().trim();
  if (userInput) {
    // 검색어가 입력되었을 때 서버에 검색 요청 보내기
    searchPosts(userInput);
  }
});
const getInitialCrawledData = async () => {
  try {
    // 서버에서 초기 크롤링 데이터를 가져오는 요청을 보냅니다.
    const response = await axios.get(`https://xyz.waguwagu.online/api/getCrawledRecipes`);
    const crawledData = response.data.data;

    // 처음 6개의 크롤링 데이터를 메인 페이지에 표시합니다.
    displayCrawledData(crawledData.slice(0, 6));
  } catch (error) {
    console.log(error);
  }
};

const displayCrawledData = (data) => {
  let allHtml = '';

  data.forEach((item) => {
    let tempHtml = `
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm">
          <img src="${item.recipe_img}" alt="${item.recipe_title}" class="card-img-top">
          <div class="card-body">
            <p class="card-text">${item.recipe_title}</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="btn-group">
              </div>
             
            </div>
          </div>
        </div>
      </div>`;
    allHtml += tempHtml;
  });

  // 크롤링 데이터를 메인 페이지의 카드 리스트에 추가합니다.
  $('#card-list').prepend(allHtml);
};

// 검색어 입력창 밖을 클릭하면 검색 박스를 숨김
document.addEventListener('click', (event) => {
  if (!searchInput.contains(event.target) && !searchBox.contains(event.target)) {
    searchBox.style.display = 'none';
  }
});

$(document).ready(function () {
  $('#search-bar').keypress(function (e) {
    if (e.which == 13) {
      e.preventDefault();

      const userInput = $('#search-bar').val();
      const title = $('#search-bar').val();

      if (userInput.startsWith('#')) {
        // 검색어가 '#'으로 시작하는 경우
        // 다른 API를 호출하거나 원하는 작업을 수행합니다.
        const hashtag = userInput.substring(1); // '#'을 제외한 검색어 추출

        axios
          .get(`/api/posts/hashtag?hashtag=${hashtag}`)
          .then(function (response) {
            // API 응답을 처리합니다.
            const searchData = response.data;
            // searchData를 사용하여 검색 결과를 화면에 표시하거나 다른 작업을 수행합니다.
            console.log(searchData);

            // 검색 결과를 화면에 표시하는 코드를 작성합니다.
            SearchResults(searchData.data);
          })
          .catch(function (error) {
            console.error('API 요청 중 오류 발생:', error);
          });
      } else {
        axios
          .get(`https://xyz.waguwagu.online/api/posts/title?title=${title}`)
          .then(function (response) {
            // API 응답을 처리합니다.
            const searchData = response.data;
            // searchData를 사용하여 검색 결과를 화면에 표시하거나 다른 작업을 수행합니다.
            console.log(searchData);

            // 검색 결과를 화면에 표시하는 코드를 작성합니다.
            displaySearchResults(searchData.data);
          })
          .catch(function (error) {
            console.error('API 요청 중 오류 발생:', error);
          });
      }
    }
  });
});

// 검색 결과를 화면에 표시하는 함수
function displaySearchResults(searchResults) {
  $('#card-list').empty(); // 기존 게시글 리스트를 비웁니다.

  if (searchResults.length === 0) {
    // 검색 결과가 없을 경우 메시지를 표시합니다.
    $('#card-list').append('<p>검색 결과가 없습니다.</p>');
  } else {
    // 검색 결과를 카드로 표시합니다.
    searchResults.forEach(function (item) {
      // 게시글 정보가 삭제된 경우 처리
      if (!item.User || !item.created_at) {
        return; // 삭제된 게시글은 무시하고 다음 항목으로 넘어갑니다.
      }

      const cretedAt = convertToKST(item.created_at);
      let tempHtml = `
        <div class="col-md-4 mb-4">
          <div class="card shadow-sm">
            <img src="${item.food_img}" id="post-img-click" post-id="${item.id}" alt="${item.title}" class="card-img-top">
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
      $('#card-list').append(tempHtml);
    });
  }
}

function SearchResults(searchResults) {
  $('#card-list').empty(); // 기존 게시글 리스트를 비웁니다.

  if (searchResults.length === 0) {
    // 검색 결과가 없을 경우 메시지를 표시합니다.
    $('#card-list').append('<p>검색 결과가 없습니다.</p>');
  } else {
    // 검색 결과를 카드로 표시합니다.
    searchResults.forEach(function (item) {
      // 게시글 정보가 삭제된 경우 처리
      if (!item.Post) {
        return; // 삭제된 게시글은 무시하고 다음 항목으로 넘어갑니다.
      }

      const cretedAt = convertToKST(item.Post.created_at);
      let tempHtml = `
        <div class="col-md-4 mb-4">
          <div class="card shadow-sm">
            <img src="${item.Post.food_img}" id="post-img-click" post-id="${item.Post.id}" alt="${item.Post.title}" class="card-img-top">
            <div class="card-body">
              <p class="card-text">${item.Post.title}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <p>${item.Post.User.nickname}</p>
                </div>
                <small class="text-body-secondary">${cretedAt}</small>
                <span class="like-count">❤️ ${item.Post.like} </span> 
              </div>
            </div>
          </div>
        </div>`;
      $('#card-list').append(tempHtml);
    });
  }
}

// 로고 클릭 이벤트 리스너 추가
document.getElementById('logo').addEventListener('click', function () {
  location.reload(); // 페이지 새로고침
});
