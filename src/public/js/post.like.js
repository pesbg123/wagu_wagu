$(document).ready(() => {
  const url = new URL(window.location.href);
  const userId = url.pathname.split('/')[2];

  getLikePosts(userId);
});

// 해당 유저의 좋아요 게시물 가져오는 함수
const getLikePosts = async (userId) => {
  try {
    const response = await axios.get(`/api/users/${userId}/liked_posts`);
    const posts = response.data.data.list;

    let allHtml = '';
    posts.forEach((item) => {
      const createdAt = convertToKST(item.Post.created_at);
      let tempHtml = `
            <div class="col-md-4 mb-4">
              <div class="card shadow-sm">
                <img src="${item.Post.food_img}" alt="${item.Post.title}" class="card-img-top">
                <div class="card-body">
                  <p class="card-text">${item.Post.title}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <p>${item.Post.User.nickname}</p>
                    </div>
                    <small class="text-body-secondary">${createdAt}</small>
                  </div>
                </div>
              </div>
            </div>`;

      allHtml += tempHtml;
    });

    $('#card-list').append(allHtml);
  } catch (error) {
    console.error(error);
    alert(error.response.data.data.errorMessage);
  }
};

// 한국 시간으로 변환하는 함수
const convertToKST = (dateUTCString) => {
  const dateUTC = new Date(dateUTCString);
  return dateUTC.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
};

// const likeButton = document.getElementById('likeButton');
// likeButton.addEventListener('click', 함수);

// const likedPostsList = document.getElementById('likedPostsList');

// const getAllUsers = async () => {
//   try {
//     const response = await axios.get('/api/users');

//     let allHtml = '';

//     response.data.forEach((item) => {
//       allHtml += createUserRow(item);
//     });
//     $('.user-list-body').html(allHtml);
//   } catch (error) {
//     console.error(error);
//   }
// };

// // 좋아요 버튼 클릭 시
// likeButton.addEventListener('click', async () => {
//   try {
//     const response = await fetch(`/user/liked-posts`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ user_id }),
//     });

//     if (!response.ok) {
//       throw new Error('서버에서 데이터를 가져오지 못했습니다.');
//     }

//     const data = await response.json();
//     console.log(data.message);

//     // 좋아요 목록 갱신
//     await loadLikedPosts();
//   } catch (error) {
//     console.error('좋아요 추가 중 오류:', error);
//   }
// });

// // 좋아요 목록 로드 함수
// async function loadLikedPosts() {
//   try {
//     const response = await axios(`/user/liked-posts`);
//     if (!response.ok) {
//       throw new Error('서버에서 데이터를 가져오지 못했습니다.');
//     }

//     const likedPosts = await response.json();

//     // 좋아요된 게시물 목록 출력
//     likedPostsList.innerHTML = '';
//     likedPosts.forEach((item) => {
//       likedPostsList.innerHTML += `<p>게시물 ID: ${item.post_id}, 사용자 ID: ${item.user_id}</p>`;
//     });
//   } catch (error) {
//     console.error('좋아요 목록 조회 중 오류:', error);
//   }
// }

// // 페이지 로드 시 좋아요 목록 로드
// loadLikedPosts();
