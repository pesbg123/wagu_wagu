const signinBtn = document.querySelector('.signinBtn');
const signupBtn = document.querySelector('.signupBtn');
const body = document.querySelector('body');

signupBtn.addEventListener('click', () => {
  body.classList.add('slide');
});

signinBtn.addEventListener('click', () => {
  body.classList.remove('slide');
});

//로그인
const loginForm = document.querySelector('.signinform form');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.querySelector('.signinform input[type="text"]').value;
  const password = document.querySelector('.signinform input[type="password"]').value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.ok) {
      // 로그인 성공시 페이지 이동
      // const authHeader = response.headers.get('Authorization');
      // const parts = authHeader.split(' ');
      // const WGID = parts[1];

      // if (authHeader && authHeader.startsWith('Bearer ')) {
      //   const now = new Date();
      //   const oneHourLater = new Date(now.getTime() + 20 * 60 * 1000);
      //   const cookieExpirationDate = oneHourLater.toUTCString();
      //   document.cookie = `WGID=${WGID}; path=/; expires=${cookieExpirationDate}; httponly=true;`;
      //   // console.log(document.cookie);
      // }
      const data = await response.json();

      if (data.admin === 'true') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    } else {
      const data = await response.json();
      alert(`로그인 실패: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

//회원가입
const registerForm = document.querySelector('.signupform form');

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.querySelector('.signupform input[type="text"]').value;
  const password = document.querySelector('.signupform input[type="password"]').value;

  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
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
