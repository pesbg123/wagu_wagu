const headers = {
  headers: {
    'Content-Type': 'application/json',
    authorization: `${getCookie('WGID')}`,
  },
};

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

const findMyPosts = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/posts/mypost', headers);

    if (response.status === 200) {
      const posts = response.data; // 서버에서 받아온 게시물 데이터

      let tempHtml = '';

      // 게시물 데이터를 사용하여 HTML을 동적으로 생성
      posts.forEach((post) => {
        tempHtml += `
            <div class="col mb-5">
              <div class="card h-100">
                <img class="card-img-top" src="${post.food_img}" alt="..." />
                <div class="card-body p-4">
                  <div class="text-center">
                    <h5 class="fw-bolder">${post.title}</h5>
                    ${post.nickname}
                  </div>
                </div>
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                  <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="#">View options</a></div>
                </div>
              </div>
            </div>
          `;
      });

      // 동적으로 생성한 HTML을 페이지에 추가
      document.getElementById('postContainer').innerHTML = tempHtml;
    } else {
      console.error('게시물을 불러오는 동안 오류 발생:', response.statusText);
    }
  } catch (error) {
    console.error('게시물을 불러오는 동안 오류 발생:', error);
  }
};

// 페이지 로드 시 findMyPosts 함수 호출
$(document).ready(function () {
  findMyPosts();
});
