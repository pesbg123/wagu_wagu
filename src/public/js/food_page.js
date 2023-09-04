/* eslint-disable no-undef */
$(document).ready(() => {
  getPosts();
  getComments();
  getReply();
  editComment();
  deleteComment();
  deleteReply();
  reportPost();
  $('#submitCommentBtn').click(() => {
    submitComment();
  });

  // URL을 가변적으로 변경하기 위해.
  // const urlPath = window.location.pathname;
  // const pathSegments = urlPath.split('/');
  // const post_id = pathSegments[2];

  // if (post_id) {
  //   getPosts(post_id);
  //   getComments(post_id);
  //   getReply(post_id);
  // } else {
  //   console.error('post_id');
  // }
});

const post_id = 1; // <- 테스트를 위해 하드코딩

const getPosts = async (/*post_id*/) => {
  try {
    const response = await axios.get(`/api/posts/${post_id}`);

    let tempHtml = `<div class="resume-section-content">
                        <h2 class="mb-5">${response.data.data.title} 
                            <button class="reportPostBtn" data-post-id="${response.data.data.id}">게시글 신고</button>
                        </h2>
                        <div class="d-flex flex-column flex-md-row justify-content-between mb-5">
                          <div class="flex-grow-1">
                            <h3 class="mb-0">재료 목록</h3>
                            <p>
                              ${response.data.data.ingredient}
                            </p>
                          </div>
                        </div>
                        <div class="d-flex flex-column flex-md-row justify-content-between">
                          <div class="flex-grow-1">
                            <div class="subheading mb-3">조리법</div>
                            <p>${response.data.data.recipe}</p> <!-- 조리법을 출력해야 하므로 response.data.recipe로 수정 -->
                          </div>
                        </div>`;

    $('.posts').html(tempHtml);
  } catch (error) {
    console.error(error);
  }
};

// 게시물 신고
const reportPost = async (postId) => {
  // postId 매개변수 추가
  try {
    await axios.patch(`/api/posts/${postId}/block`);
    alert('게시글이 신고되었습니다.');
  } catch (error) {
    console.error(error);
  }
};

$(document).on('click', '.reportPostBtn', function () {
  // 클래스 선택자로 변경
  const postId = $(this).data('post-id'); // data-post-id 값을 가져옴
  console.log(`게시글 ${postId} 신고 버튼 클릭됨`);
  reportPost(postId); // postId 전달
});

// 댓글 조회
const getComments = async () => {
  try {
    const response = await axios.get('/api/comments');
    let allHtml = '';

    response.data.data.forEach((comment) => {
      if (comment.reply_id === null) {
        let tempHtml = `<div class="one-comment">
                          <p id="postCommentContent_${comment.id}">
                            ${comment.content}
                          </p>
                          <button comment-id="${comment.id}">수정</button>
                          <button comment-id="${comment.id}">신고</button>
                          <button id="deleteCommentBtn_${comment.id}" comment-id="${comment.id}">삭제</button>
                        </div>`;
        allHtml += tempHtml;
      }
    });

    $('.comments-container').html(allHtml);
  } catch (error) {
    console.error(error);
  }
};

$(document).on('click', '[id^=deleteCommentBtn_]', function () {
  const comment_id = this.id.split('_')[1];

  //확인을 위한 모달창.
  if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
    deleteComment(comment_id);
  }
});

// 댓글 삭제
const deleteComment = async (comment_id) => {
  try {
    await axios.delete(`/api/comments/${comment_id}`);

    //
    $(`#postCommentContent_${comment_id}`).parent().remove();

    alert('댓글이 성공적으로 삭제되었습니다.');
  } catch (error) {
    console.error(error);
  }
};

// 댓글 수정
const editComment = async (comment_id, newContent) => {
  try {
    await axios.put(`/api/comments/${comment_id}`, {
      content: newContent,
    });
    $(`#postCommentContent_${comment_id}`).text(newContent);

    alert('댓글이 성공적으로 수정되었습니다.');
  } catch (error) {
    console.error(error);
  }
};
$(document).on('click', 'button:contains("수정")', function () {
  const comment_id = $(this).attr('comment-id');

  const newContent = prompt('댓글을 수정하세요.');

  if (newContent !== null && newContent.trim() !== '') {
    editComment(comment_id, newContent);
  }
});

// 대댓글 조회
const getReply = async () => {
  try {
    const response = await axios.get('/api/comments');
    let allHtml = '';

    response.data.data.forEach((comment) => {
      if (comment.reply_id !== null) {
        let tempHtml = `<div class="one-reply">
                          <p>
                            ${comment.content}
                          </p>
                          <button comment-id="${comment.id}">수정</button>
                          <button comment-id="${comment.id}">신고</button>
                          <button id="deleteReplyBtn_${comment.id}" comment-id="${comment.id}">삭제</button>
                        </div>`;
        allHtml += tempHtml;
      }
    });

    $('.reply-container').html(allHtml);
  } catch (error) {
    console.error(error);
  }
};

$(document).on('click', '[id^=deleteReplyBtn_]', function () {
  const comment_id = this.id.split('_')[1];

  // 대댓글 확인을 위한 모달창.
  if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
    deleteReply(comment_id);
  }
});

// 대댓글 삭제
const deleteReply = async (comment_id) => {
  try {
    await axios.delete(`/api/comments/${comment_id}`);

    // Remove the deleted comment from the display
    $(`#deleteReplyBtn_${comment_id}`).parent().remove();

    alert('대댓글이 성공적으로 삭제되었습니다.');
  } catch (error) {
    console.error(error);
  }
};

// 댓글 제출
const submitComment = async () => {
  try {
    const commentText = $('#commentText').val();

    if (!commentText.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    await axios.post(`/api/comments/${post_id}`, {
      content: commentText,
      post_id: post_id,
      reply_id: null,
    });

    $('#commentText').val('');

    getComments();

    // 확인용 모달창
    $('#commentModal').modal('show');
  } catch (error) {
    console.error(error);
  }
};

// 댓글 신고
$(document).on('click', 'button[comment-id]', function () {
  const comment_id = $(this).attr('comment-id');
  const reportReason = prompt('댓글을 신고하는 이유를 입력하세요.');

  if (reportReason !== null && reportReason.trim() !== '') {
    reportComment(comment_id, reportReason);
  }
});

// 댓글을 서버에 신고
const reportComment = async (post_id, comment_id, reportReason) => {
  try {
    // 서버에 PATCH 요청을 보내 댓글을 신고
    await axios.patch(`/api/posts/${post_id}/comments/${comment_id}/block`, {
      reason: reportReason,
    });

    // 댓글이 성공적으로 신고되었을 때 알림을 띄움
    alert('댓글이 성공적으로 신고되었습니다.');
  } catch (error) {
    console.error('댓글 신고 오류:', error);
    // 오류 발생 시 오류 내용을 콘솔에 출력
  }
};
