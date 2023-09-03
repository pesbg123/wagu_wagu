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
        loginId: id,
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
        loginId: id,
        password: password,
      }),
    });

    if (response.ok) {
      // 로그인 성공시 페이지 이동
      window.location.href = './index.js';
    } else {
      const data = await response.json();
      alert(`로그인 실패: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
