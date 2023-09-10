/* eslint-disable no-undef */
$(document).ready(() => {
  // URL을 가변적으로 변경하기 위해.
  const urlPath = window.location.pathname;
  const pathSegments = urlPath.split('/');
  const post_id = pathSegments[2];

  // 하드코딩된 로그인한 사용자의 아이디
  const loggedInUserId = 2;

  if (post_id) {
    getPosts(post_id, loggedInUserId);
    getComments(post_id, loggedInUserId);
  } else {
    console.error('Invalid post ID');
  }

  $('#submitCommentBtn').click(() => {
    submitComment(post_id); // post_id 전달
  });
});

const getPosts = async (post_id, loggedInUserId) => {
  try {
    const response = await axios.get(`/api/posts/${post_id}`);

    let tempHtml = `<div class="resume-section-content">
                        <h2 class="mb-5">${response.data.data.title}`;

    // 사용자 user_id와 포스트의 작성자 user_id가 일치하지 않을 경우에만 게시글 신고 버튼 표시
    if (loggedInUserId !== response.data.data.user_id) {
      tempHtml += `<button class="reportPostBtn" data-post-id="${response.data.data.id}">게시글 신고</button>`;
    }

    tempHtml += `</h2>
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
                      <p>${response.data.data.recipe}</p>`;

    // 이미지 요소.
    if (response.data.data.food_img) {
      tempHtml += `<img src="${response.data.data.food_img}" alt="${response.data.title}" />`;
    }

    tempHtml += `</div>
                </div>`;

    tempHtml += '</br></br>';

    $('.posts').html(tempHtml);
  } catch (error) {
    console.error(error);
  }
};

const reportPost = async (post_id) => {
  try {
    await axios.patch(`/api/posts/${post_id}/block`);
    alert('게시글이 신고되었습니다.');
  } catch (error) {
    console.error(error);
  }
};

$(document).on('click', '.reportPostBtn', function () {
  const post_id = $(this).data('post-id');
  reportPost(post_id);
});

//댓글 조회
const getComments = async (post_id, loggedInUserId) => {
  try {
    const response = await axios.get(`/api/comments/${post_id}`);
    let allHtml = '';

    if (response.data.data.length === 0) {
      // 만약 댓글이 없다면
      allHtml = '<p>아직 등록된 댓글이 없습니다.</p>';
    } else {
      response.data.data.forEach((comment) => {
        let tempHtml = `<div class="${comment.reply_id ? 'reply-comment' : 'original-comment'}">
                  <p id="postCommentContent_${comment.id}">
                  ${comment.content}
                  </p>`;

        // 로그인한 사용자와 댓글 작성자의 user_id 비교
        if (loggedInUserId === comment.user_id) {
          // 사용자가 댓글 작성자인 경우 수정, 삭제, 대댓글 버튼 보이기
          tempHtml += `
            <button id="editCommentBtn_${comment.id}" class="edit-button">수정</button>
            <button id="deleteCommentBtn_${comment.id}" class="delete-button">삭제</button>
            <button id="replyCommentBtn_${comment.id}" data-post-id="${comment.post_id}" data-comment-id="${comment.reply_id}">대댓글 작성</button>
          `;
        } else {
          // 사용자가 댓글 작성자가 아닌 경우 신고, 대댓글 버튼 보이기
          tempHtml += `
            <button class="report-button" data-post-id="${post_id}" data-comment-id="${comment.id}">신고123</button>
            <button id="replyCommentBtn_${comment.id}" data-post-id="${comment.post_id}" data-comment-id="${comment.reply_id}">대댓글 작성</button>
          `;
        }

        tempHtml += '</div><br></br>';
        allHtml += tempHtml;
      });
    }

    $('.comments-container').html(allHtml);
  } catch (error) {
    console.error(error);
  }
};

$(document).on('click', '[id^=deleteCommentBtn_]', function () {
  const comment_id = this.id.split('_')[1];
  if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
    deleteComment(comment_id);
  }
});

const deleteComment = async (comment_id) => {
  try {
    await axios.delete(`/api/comments/${comment_id}`);
    $(`#postCommentContent_${comment_id}`).parent().remove();
    alert('댓글이 성공적으로 삭제되었습니다.');
  } catch (error) {
    console.error(error);
  }
};

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

$(document).on('click', 'button.edit-button', function () {
  const comment_id = $(this).attr('comment-id');
  const newContent = prompt('댓글을 수정하세요.');

  if (newContent !== null && newContent.trim() !== '') {
    editComment(comment_id, newContent);
  }
});

// 댓글 제출
const submitComment = async (post_id) => {
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
    getComments(post_id);

    // 확인용 모달창
    $('#commentModal').modal('show');
  } catch (error) {
    console.error(error);
  }
  // 자동 새로고침
  getComments(post_id);
};

// 댓글 신고
const reportComment = async (post_id, comment_id) => {
  try {
    await axios.patch(`/api/posts/${post_id}/comments/${comment_id}/block`);
    alert('댓글이 성공적으로 신고되었습니다.');
    getComments(post_id); // 화면에서 바로 변경사항 반영
  } catch (error) {
    console.error(error);
  }
};

$(document).on('click', '.report-button', function () {
  const post_id = $(this).data('post-id');
  const comment_id = $(this).data('comment-id');

  if (confirm('정말로 이 댓글을 신고하시겠습니까?')) {
    reportComment(post_id, comment_id);
  }
});

//대댓글 작성
const submitReplyComment = async (post_id, reply_id) => {
  try {
    const commentText = $('#replyCommentText').val();

    if (!commentText.trim()) {
      alert('대댓글 내용을 입력해주세요.');
      return;
    }

    console.log(`post_id=${post_id}, reply_id=${reply_id}, content=${commentText}`);

    const response = await axios.post(`/api/comments/${post_id}`, {
      content: commentText,
      reply_id: reply_id, // 대댓글의 ID를 reply_id로 전달
    });

    console.log(`Response from server: ${JSON.stringify(response.data)}`);

    $('#replyCommentText').val('');

    // 확인용 모달창
    $('#commentModal').modal('show');
  } catch (error) {
    console.error(error);
  }

  // 자동 새로고침
  getComments(post_id);

  // 대댓글 작성이 완료되면 대댓글 작성 모달창 닫기
  $('#replyModal').modal('hide');
};

// 이벤트 핸들러 등록 - 대댓글 작성 버튼 클릭 시 동작
$(document).on('click', '[id^=replyCommentBtn_]', function () {
  const post_id = $(this).data('post-id'); // post_id 가져오기
  const reply_id = $(this).data('comment-id'); // 부모 댓글의 id 가져오기

  // 대댓글 작성 모달창 띄우기
  $('#replyModal').modal('show');

  // 대댓글 제출 버튼에 이벤트 핸들러 추가
  $('#submitReplyBtn')
    .off()
    .click(() => {
      submitReplyComment(post_id, reply_id); // post_id와 reply_id를 올바르게 전달
    });
});
