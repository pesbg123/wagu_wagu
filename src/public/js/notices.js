$(document).ready(() => {
  const url = new URL(window.location.href);
  const noticeId = url.pathname.split('/')[2]; // '/notice/:id' 에서 id 값 추출

  getOneNotice(noticeId);
});

$('.go-back-btn').click(() => {
  location.href = '/';
});

// 공지 상세
const getOneNotice = async (id) => {
  try {
    const response = await axios.get(`/api/adminNotices/${id}`);
    const notice = response.data;

    let temphtml = `<p>${notice.content}</p>`;

    $('.notice-card').html(temphtml);
  } catch (error) {
    console.log(error);
    alert(error.response.data.errorMessage);
  }
};
