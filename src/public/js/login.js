// 처음 페이지 로드될 때 쓰는 함수를 사용하거나 ex)document.addEventListener 에 아래 로직을 적용시켜야 함
// 사용하지 않는다면 해당 페이지의 모든 API통신에 아래 로직을 적용 시켜야 함
// if (response.ok) {
// } else {
//   const data = await response.json();
//   if (data.message === '관리자 권한이 필요합니다.') {
//     alert('로그인이 필요한 기능입니다.');
//     window.location.href = '/';
//   }
//   if (data.message === '액세스 토큰 오류') {
//     alert('로그인이 필요한 기능입니다.');
//     window.location.href = '/';
//   } else if (data.message === '리프레시 토큰 만료') {
//     alert('로그인이 필요한 기능입니다.');
//     window.location.href = '/';
//   } else if (data.message === '리프레시 토큰 오류') {
//     alert('로그인이 필요한 기능입니다.');
//     window.location.href = '/';
//   }
// }
// 이었는데 로그인 로직 변경으로 위 로직 필요없음.
//

const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
// const textLogo = document.querySelector('.text-logo');

// registerLink.addEventListener('click', () => {
//   wrapper.classList.add('active');
// });

// loginLink.addEventListener('click', () => {
//   wrapper.classList.remove('active');
// });

//회원가입
const registerForm = document.querySelector('.register-form');

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = registerForm.querySelector('#register-id input').value;
  const password = registerForm.querySelector('#register-password input').value;

  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: id,
        password: password,
      }),
    });

    if (response.ok) {
      alert('회원가입이 완료되었습니다.');
      // 회원가입 성공 후 로그인 페이지로 이동
      window.location.reload();
    } else {
      const data = await response.json();
      alert(`회원가입 실패: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

//로그인
const loginForm = document.querySelector('.login-form');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = loginForm.querySelector('#login-id input').value;
  const password = loginForm.querySelector('#login-password input').value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: id,
        password: password,
      }),
    });

    if (response.ok) {
      // 로그인 성공시 페이지 이동
      // 서버 응답에서 Authorization 헤더를 가져옴
      const authHeader = response.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
        const cookieExpirationDate = oneHourLater.toUTCString();
        document.cookie = `Authorization=${authHeader}; path=/; expires=${cookieExpirationDate}; Secure; SameSite=Strict`;
        console.log(document.cookie);
        // 쿠키에서 액세스 토큰을 가져올 때는 다음과 같이 사용
        // const storedAccessToken = getCookie('accessToken');
        // 쿠키에서 특정 이름의 쿠키 값을 가져오는 함수
        // function getCookie(name) {
        //   const cookies = document.cookie.split(';');
        //   for (const cookie of cookies) {
        //     const [cookieName, cookieValue] = cookie.split('=');
        //     if (cookieName.trim() === name) {
        //       return cookieValue;
        //     }
        //   }
        //   return null;
        // }
      }
      const data = await response.json();

      console.log('🚀 ~ file: login.js:118 ~ loginForm.addEventListener ~ data:', data.admin);

      if (data.admin === true) {
        window.location.href = '/admin';
      } else {
        // window.location.href = '/';
      }
    } else {
      const data = await response.json();
      alert(`로그인 실패: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
