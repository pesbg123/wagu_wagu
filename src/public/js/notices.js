$(document).ready(() => {
  const url = new URL(window.location.href);
  const noticeId = url.pathname.split('/')[2]; // '/notice/:id' 에서 id 값 추출

  getOneNotice(noticeId);
  $('.go-back-btn').click(() => {
    location.href = '/';
  });
});

const headers = {
  headers: {
    'Content-Type': 'application/json',
    authorization: `${getCookie('WGID')}`,
  },
};

// 공지 상세
const getOneNotice = async (id) => {
  try {
    const response = await axios.get(`/api/adminNotices/${id}`, headers);
    const notice = response.data;

    let temphtml = `<p>${notice.content}</p>`;

    $('.notice-card').html(temphtml);
  } catch (error) {
    console.log(error);
    alert(error.response.data.errorMessage);
  }
};

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
