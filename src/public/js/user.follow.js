$(document).ready(() => {
  const url = new URL(window.location.href);
  const userId = url.pathname.split('/')[2];

  getFollowedUsers(userId);
});

// 해당 유저의 팔로우한 사용자 가져오는 함수
const getFollowedUsers = async (userId) => {
  try {
    const authorization = getCookie('WGID');
    const response = await fetch(`/api/users/${userId}/followers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
    });

    if (!response.ok) {
      throw new Error('액세스 토큰 오류');
    }

    const users = await response.json();

    displayUsers(users.data); // 사용자 목록을 화면에 표시
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

// 쿠키에서 값을 가져오는 함수
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
// 사용자 목록을 화면에 표시하는 함수
function displayUsers(users) {
  const userListContainer = $('#followed-users');

  if (!Array.isArray(users)) {
    // 사용자 목록이 배열인지 확인
    console.error('사용자 목록이 유효하지 않습니다.');
    return;
  }

  users.forEach((user) => {
    // 각 사용자 정보를 HTML로 변환하여 출력
    const userHtml = `
        <div class="user-card">
          <img src="${user.user_img}" alt="${user.nickname}" class="user-avatar">
          <div class="user-details">
            <h6 class="user-name">${user.nickname}</h6>
          </div>    
        </div>    
      `;

    userListContainer.append(userHtml); // 생성된 HTML을 컨테이너에 추가
  });
}
