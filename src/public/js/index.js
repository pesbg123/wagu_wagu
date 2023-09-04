function loadContent(elementId, url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      document.getElementById(elementId).innerHTML = xhr.responseText;
    }
  };
  xhr.send();
}

window.onload = function () {
  loadContent('header', 'header.html');
  // loadContent('footer', 'footer.html');

  const loginBtn = document.getElementById('loginBtn');

  console.log('🚀 ~ file: index.js:18 ~ loginBtn:', loginBtn);

  const logoutBtn = document.getElementById('logoutBtn');

  // 인증 응답을 처리하고 버튼을 조작하는 함수
  function handleAuthenticationResponse(success) {
    if (loginBtn && logoutBtn) {
      if (success) {
        // 인증 성공
        loginBtn.style.display = 'none'; // 로그인 버튼 숨김
        logoutBtn.style.display = 'block'; // 로그아웃 버튼 표시
      } else {
        // 인증 실패
        loginBtn.style.display = 'block'; // 로그인 버튼 표시
        logoutBtn.style.display = 'none'; // 로그아웃 버튼 숨김
      }
    }
  }
};

$(document).ready(() => {
  getPosts();
  // 쿠키에서 'Authorization' 값을 가져오는 함수
  const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  };

  // 'Authorization' 쿠키를 가져옴
  const authToken = getCookie('Authorization');

  // 'Authorization' 쿠키가 존재할 때만 실행
  if (authToken) {
    fetchTestAPI(); // 초기 로드 시 한 번 실행
    setInterval(fetchTestAPI, 900000); // 주기적으로 실행
  }
});

// fetchTestAPI 함수 내에서 응답 상태에 따라 호출
const fetchTestAPI = async () => {
  try {
    const response = await fetch('/api/verify', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      handleAuthenticationResponse(true); // 성공 처리
    } else {
      handleAuthenticationResponse(false); // 실패 처리
      // const data = await response.json();
    }
  } catch (error) {
    console.error('Error:', error);
    handleAuthenticationResponse(false); // 에러 처리
  }
};

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

// const form = document.querySelector('#postForm');
// form.addEventListener('submit', post);
