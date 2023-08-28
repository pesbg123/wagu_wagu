const noticeBtn = document.getElementById('notice-btn');
const hashtagBtn = document.getElementById('hashtag-btn');
const reportBtn = document.getElementById('report-btn');

noticeBtn.addEventListener('click', () => {
  location.href = '/admin_notices';
});

hashtagBtn.addEventListener('click', () => {
  location.href = '/admin_hashtags';
});

reportBtn.addEventListener('click', () => {
  location.href = '/admin_reports';
});
