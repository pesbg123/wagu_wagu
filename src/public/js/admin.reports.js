/* eslint-disable no-undef */
$(document).ready(() => {
  getReportList();
});

const headers = {
  headers: {
    'Content-Type': 'application/json',
    authorization: `${getCookie('WGID')}`,
  },
};

$('#go-back-index').click(() => (location.href = '/admin'));

// 신고 목록 조회
const getReportList = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/reports`, headers);

    let postHtml = ``;
    let commentHtml = ``;
    response.data.getReportList.forEach((item) => {
      // comment_id가 존재하면 댓글 신고 목록에 추가
      if (item.comment_id) {
        let temphtml = ` <tr>
                            <td>${item['User.nickname']}</td>
                            <td><a href="#">${item['Post.title']}</a></td>
                            <td>${item['Comment.content']}</td>
                            <td>${item['report_type']}</td>
                            <td>${item['reported_reason']}</td>
                        </tr>`;
        commentHtml += temphtml;
      } else {
        let temphtml = `<tr>
                          <td>${item['User.nickname']}</td>
                          <td><a href="#">${item['Post.title']}</a></td>
                          <td>${item['report_type']}</td>
                          <td>${item['reported_reason']}</td>
                        </tr>`;
        postHtml += temphtml;
      }
    });
    $('.post-report-body').html(postHtml);
    $('.comment-report-body').html(commentHtml);
  } catch (error) {
    console.log(error);

    alert(error.response.data.errorMessage);
  }
};
