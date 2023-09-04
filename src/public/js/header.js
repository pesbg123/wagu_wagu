$(document).ready(() => {
  // getPosts();
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
  const handleAuthenticationResponse = (success) => {
    const loginBtn = document.getElementById('loginBtn');

    console.log('🚀 ~ file: index.js:34 ~ handleAuthenticationResponse ~ loginBtn:', loginBtn);

    const logoutBtn = document.getElementById('logoutBtn');

    if (loginBtn && logoutBtn) {
      if (success) {
        // 성공적인 응답을 받았을 때의 처리
        loginBtn.style.display = 'none'; // loginBtn 숨기기
        logoutBtn.style.display = 'block'; // logoutBtn 보이기
      } else {
        // 응답이 실패했을 때의 처리
        loginBtn.style.display = 'block'; // loginBtn 보이기
        logoutBtn.style.display = 'none'; // logoutBtn 숨기기

        // 쿠키에서 Authorization 제거
        document.cookie = 'Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
    }
  };

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
