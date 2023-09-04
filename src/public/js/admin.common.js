async function verify() {
  try {
    const authorization = getCookie('Authorization'); // Authorization 값을 가져옴

    const response = await fetch('/api/admin/verify', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
    });

    if (response.ok) {
      console.log('response Ok');
    } else {
      const data = await response.json();
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// 페이지가 처음 열릴 때 API 호출
window.onload = verify;

// // 새로고침할 때 API 호출
// window.onbeforeunload = verify;

// 15분(900,000 밀리초)마다 API 호출
setInterval(verify, 900000);
