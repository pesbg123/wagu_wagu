async function verify() {
  try {
    // const authorization = getCookie('WGID'); // Authorization 값을 가져옴

    const response = await fetch('/api/verify', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `${getCookie('WGID')}`,
      },
    });

    if (response.ok) {
      console.log('response Ok');
      if (window.location.pathname === '/') {
        function handleAuthenticationResponse(success) {
          const loginBtn = document.getElementById('loginBtn');
          const logoutBtn = document.getElementById('logoutBtn');
          const postBtn = document.getElementById('postBtn');

          if (loginBtn && logoutBtn && postBtn) {
            if (success) {
              // 인증 성공
              loginBtn.style.display = 'none'; // 로그인 버튼 숨김
              logoutBtn.style.display = 'block'; // 로그아웃 버튼 표시
              postBtn.style.display = 'block';
            } else {
              // 인증 실패
              loginBtn.style.display = 'block'; // 로그인 버튼 표시
              logoutBtn.style.display = 'none'; // 로그아웃 버튼 숨김
              postBtn.style.display = 'none';
            }
          }
        }

        handleAuthenticationResponse(true);
      }
    } else {
      const data = await response.json();
      if (data.message === '액세스 토큰 오류') {
        // 페이지가 '/' 인 경우 리디렉션
        if (window.location.pathname === '/') {
          return;
        } else {
          // 다른 페이지인 경우 리디렉션
          window.location.href = '/';
        }
      }
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// 쿠키에서 특정 이름의 쿠키 값을 가져오는 함수
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

// 페이지가 처음 열릴 때 API 호출
window.onload = verify;

// // 새로고침할 때 API 호출
// window.onbeforeunload = verify;

// 15분(900,000 밀리초)마다 API 호출
setInterval(verify, 900000);

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');

  console.log('🚀 ~ file: user.common.js:65 ~ document.addEventListener ~ logoutBtn:', logoutBtn);

  console.log('123123', getCookie('WGID'));
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      event.preventDefault();

      try {
        console.log(333);

        const response = await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `${getCookie('WGID')}`,
          },
        });

        if (response.ok) {
          deleteCookie('WGID');
          window.location.reload();
        } else {
          console.error('로그아웃 실패', error);
        }
      } catch (error) {
        console.error('에러:', error);
      }
    });
  }
});

//쿠키삭제
function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

//쿠키에서 특정 이름의 쿠키 값을 가져오는 함수
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
