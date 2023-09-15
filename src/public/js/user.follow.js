$(document).ready(() => {
  const url = new URL(window.location.href);
  const userId = url.pathname.split('/')[2];

  getFollowedUsers(userId);
});

const headers = {
  headers: {
    'Content-Type': 'application/json',
    authorization: `${getCookie('WGID')}`,
  },
};

// 해당 유저의 팔로우한 사용자 가져오는 함수
const getFollowedUsers = async (userId) => {
  try {
    const authorization = getCookie('WGID');
    const response = await fetch(`/api/users/${userId}/followers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `${getCookie('WGID')}`,
      },
    });

    if (!response.ok) {
      throw new Error('액세스 토큰 오류');
    }

    const data = await response.json();

    let userHtml = '';

    displayUsers(data); // 사용자 목록을 화면에 표시
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
  console.log(users);
  const userListContainer = $('#followerUserList'); // 요소를 올바르게 선택하도록 수정

  if (!Array.isArray(users)) {
    // 사용자 목록이 배열인지 확인
    console.error('사용자 목록이 유효하지 않습니다.');
    return;
  }

  users.forEach((user) => {
    const userHtml = `<div class="user-card" data-user-id="${user.id}">
         <img src="${user.user_img}" alt="${user.nickname}" class="user-avatar">
         <div class="user-details">
           <h6 class="user-name">${user.nickname}</h6>
           <button class="unfollow-button">Unfollow</button>
         </div>    
       </div>`;

    userListContainer.append(userHtml);
  });

  // 팔로우 취소 버튼에 이벤트 리스너 추가
  attachUnfollowEvent();
}

async function unfollowUser(targetId) {
  try {
    const authorization = getCookie('WGID');
    const currentUserId = getUserId();

    const response = await fetch(`/api/users/${currentUserId}/unfollowers/${targetId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: `${getCookie('WGID')}`,
      },
    });

    if (!response.ok) {
      throw new Error('HTTP status ' + response.status);
    }

    const result = await response.json();

    alert(result.message);
  } catch (error) {
    console.error(error);
  }
}

// getUserId 함수를 추가하여 userId를 가져오도록 합니다.
function getUserId() {
  const url = new URL(window.location.href);
  const userId = url.pathname.split('/')[2];
  return userId;
}
// 각 사용자 카드에 이벤트 리스너 추가
function attachUnfollowEvent() {
  $('.user-card').each(function () {
    const targetId = $(this).data('user-id'); // 'data-user-id'로 수정

    $(this).on('click', function () {
      if (targetId) {
        // targetId 가 유효한 값인지 체크
        unfollowUser(targetId); // 사용자 ID를 unfollowUser 함수로 전달
        $(this).remove();
      } else {
        console.error('Invalid user id:', targetId);
      }
    });
  });
}

// 사용자 목록을 화면에 표시하는 함수
function displayUsers(users) {
  console.log(users);
  const userListContainer = $('#followerUserList');

  if (!Array.isArray(users)) {
    console.error('사용자 목록이 유효하지 않습니다.');
    return;
  }

  users.forEach((user) => {
    let userHtml = `<div class="user-card" data-user-id="${user.id}">
          <img src="${user.user_img}" alt="${user.nickname}" class="user-avatar">
          <div class="user-details">
            <h6 class="user-name">${user.nickname}</h6>
            <button class="unfollow-button">Unfollow</button>
          </div>    
        </div>`;

    userListContainer.append(userHtml);
  });

  attachUnfollowEvent();
}
