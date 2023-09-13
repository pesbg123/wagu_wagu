/* eslint-disable no-undef */
let postId;

const headers = {
  headers: {
    'Content-Type': 'application/json',
    authorization: `${getCookie('WGID')}`,
  },
};

$(document).ready(() => {
  const url = new URL(window.location.href);
  postId = url.pathname.split('/')[2];
  getPost();
  getComment();
  // getReplyComment();
});

// 한국 시간으로 변환하는 함수
const convertToKST = (dateUTCString) => {
  const dateUTC = new Date(dateUTCString);
  return dateUTC.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
};

const getPost = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/posts/${postId}`, headers);
    const createdAt = convertToKST(response.data.data.created_at);

    const tempHtml = `<!-- Post header-->
                        <header class="mb-4">
                          <!-- Post title-->
                          <h1 class="fw-bolder mb-2">${response.data.data.title}</h1>
                          <!-- Post meta content-->
                          <div class="text-muted fst-italic mb-2">
                          ${createdAt}
                          </div>
                          <!-- Btn container -->
                          <div>
                            <button style="border: none;" class="post-report-btn" post-id="${response.data.data.id}"  margin-bottom: 5px;">신고</button>
                            <button style="border: none;" class="post-edit-btn" post-id="${response.data.data.id}"  margin-bottom: 5px;">수정</button>
                            <button style="border: none;" class="post-del-btn" post-id="${response.data.data.id}" margin-bottom: 5px;">삭제</button>
                          </div>
                          <!-- Post categories-->
                          <a class="badge bg-info text-decoration-none link-light" href="#!">#한식</a>
                          <a class="badge bg-success text-decoration-none link-light" href="#!">#양식</a>
                        </header>
                        <!-- Preview image figure-->
                        <figure class="mb-4"><img class="img-fluid rounded" src="${response.data.data.food_img}"
                            alt="..." /></figure>
                        <!-- Post content-->
                        <section class="mb-5">
                          <h2 class="fw-bolder mb-4 mt-5">준비 재료</h2>
                          <p class="fs-5 mb-4">${response.data.data.ingredient}</p>
                          <h2 class="fw-bolder mb-4 mt-5">레시피</h2>
                          <p class="fs-5 mb-4">${response.data.data.recipe}</p>
                          <div class="like-btn-contaier">
                          <button>❤️ 1</button>
                        </div>
                        </section>`;

    $('.one-post').html(tempHtml);
    await getUserInfo(
      response.data.data['User.id'],
      response.data.data['User.email'],
      response.data.data['User.nickname'],
      response.data.data['User.user_img'],
    );
  } catch (error) {
    console.log(error);
  }
};

const getUserInfo = async (userId, email, nickname, userImg) => {
  userInfoHtml = `<div class="card mb-4">
                    <div class="card-header">${nickname}</div>
                    <img class="card-body" user-id="${userId}" src="${userImg}" />
                    <div class="text-muted fst-italic mb-2" style="margin-left: auto; margin-right: auto;">
                      ${email}
                    </div>
                    <button>팔로워</button>
                  </div>`;
  $('.col-lg-4').html(userInfoHtml);
};

//쿠키에서 특정 이름의 쿠키 값을 가져오는 함수
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

// 댓글 조회
const getComment = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/comments/${postId}`);
    const comment = response.data.data;

    let allComment = '';
    let replyComment = '';
    comment.forEach((item) => {
      if (item.reply_id !== null) {
        replyComment = `<div class="d-flex mt-4" id="reply-comment" style="margin-left: 4rem;">
                        <div class="one-reply">
                          <div class="flex-shrink-0"><img class="rounded-circle"
                              src="${item.User.user_img}" alt="..." /></div>
                          <div class="ms-3">
                            <div class="fw-bold">답글 작성자 이름 ${item.User.nickname}</div>
                            <div>답글 ${item.content}</div>
                            <button style="border: none; margin-top: 5px;">답글</button>
                            <button style="border: none; margin-top: 5px;">신고</button>
                            <button style="border: none; margin-top: 5px;">수정</button>
                            <button style="border: none; margin-top: 5px;">삭제</button>
                          </div>
                        </div>
                      </div>`;
      } else {
        let temphtml = `<div class="d-flex mb-4 comments-container">
                          <!-- Parent comment-->
                          <div class=" one-comment" id="comment-container">
                            <div class="flex-shrink-0"><img class="rounded-circle"
                                src="${item.User.user_img}" alt="..." /></div>
                            <div class="ms-3">
                              <div class="fw-bold" id="comment-author">${item.User.nickname}</div>
                              <div>
                                ${item.content}
                              </div>
                              <button comment-id="${item.id}" id="comment-report-btn" style="border: none; margin-top: 5px;">신고</button>
                              <button class="edit-btn" comment-id="${item.id}" style="border: none; margin-top: 5px;" data-original="${item.content}">수정</button>
                              <button class="delete-btn" comment-id="${item.id}" style="border: none; margin-top: 5px;">삭제</button>
                            </div>
                            <!-- Child comment 1-->
                            <div class="d-flex mt-4 reply-comment" id="reply-comment" comment-id="${item.id}" style="margin-left: 4rem;">
                              ${replyComment}
                            </div>
                          </div>
                        </div>`;
        allComment += temphtml;
      }
    });

    $('.comment-card').html(allComment);
  } catch (error) {
    console.log(error);
  }
};

// 댓글 생성
const createComment = async () => {
  try {
    const content = $('#comment-input').val();
    if (!content) {
      alert('댓글을 입력해주세요.');
      return;
    }
    const response = await axios.post(`http://localhost:3000/api/comments/${postId}`, { content }, headers);
    console.log(response);

    location.reload();
  } catch (error) {
    console.log(error);
  }
};
// $('#comment_input').keydown((event) => {
//   if (event.key === 'Enter') {
//     event.preventDefault();
//     createComment();
//   }
// });
$('#createCmt_btn').click(createComment);

// 수정 버튼 클릭시 모달
$(document).on('click', '.edit-btn', function () {
  const commentId = $(this).attr('comment-id');

  const originalContent = $(this).data('original'); // 원본 내용 가져오기

  $('#editedComment').val(originalContent); // 인풋창 값 변경
  $('#editModal').modal('show');
  $('#editModal .modal-footer').html(
    ` <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button><button type="submit" comment-id="${commentId}" class="btn btn-dark save-btn">수정</button>`,
  );
  updateComment(commentId);
});

// 댓글 수정
const updateComment = async (commentId) => {
  try {
    const content = $('#editedComment').val();
    if (!content) {
      alert('수정할 내용을 입력해주세요.');
      return;
    }
    await axios.put(`http://localhost:3000/api/comments/${commentId}`, { content }, headers);
  } catch (error) {
    console.log(error.data);
    alert(error.response.data.data);
    location.reload();
  }
};
$(document).on('click', '.save-btn', async function () {
  await updateComment($(this).attr('comment-id'));
  location.reload();
});

// 댓글 삭제
const deleteComment = async (commentId) => {
  try {
    await axios.delete(`http://localhost:3000/api/comments/${commentId}`, headers);
    location.reload();
  } catch (error) {
    console.log(error);
    alert(error.response.data.data);
    location.reload();
  }
};
$(document).on('click', '.delete-btn', function () {
  const isConfirmed = confirm('댓글을 정말로 삭제하시겠습니까?');
  isConfirmed ? deleteComment($(this).attr('comment-id')) : location.reload();
});

// 게시글 수정 버튼 이벤트
$(document).on('click', '.post-edit-btn', function () {
  $('#editPostModal').modal('show');
});

// 댓글 신고 버튼 이벤트
$(document).on('click', '#comment-report-btn', function () {
  const commentId = $(this).attr('comment-id');

  $('#reportCommentModal').modal('show');
  $('#reportCommentModal .modal-footer').html(
    `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
    <button type="submit" comment-id="${commentId}" class="btn btn-dark report-comment-btn">제출</button>`,
  );
});

// 댓글 신고
const reportComment = async (commentId) => {
  try {
    if ($('#report-type').val() === '선택하세요') {
      alert('신고유형을 선택해주세요');
      return;
    }
    if (!$('.input-report').val()) {
      alert('신고사유를 입력해주세요');
      return;
    }
    console.log($('#report-type').val());

    await axios.post(
      `http://localhost:3000/api/posts/${postId}/comments/${commentId}/reports`,
      { report_type: $('#report-type').val(), reported_reason: $('.input-report').val() },
      headers,
    );

    alert('해당 댓글을 신고했습니다');
    location.reload();
  } catch (error) {
    console.log(error.response);
    alert(error.response.data.errorMessage);
    location.reload();
  }
};
$(document).on('click', '.report-comment-btn', async function () {
  await reportComment($(this).attr('comment-id'));
});

// 게시글 신고 버튼 이벤트
$(document).on('click', '.post-report-btn', function () {
  $('#reportPostModal').modal('show');
  $('#reportPostModal .modal-footer').html(
    `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
    <button type="submit" post-id="${postId}" class="btn btn-dark report-post-btn">제출</button>`,
  );
});

// 게시글 신고
const reportPost = async () => {
  try {
    if ($('#report-type').val() === '선택하세요') {
      alert('신고유형을 선택해주세요');
      return;
    }
    if (!$('.input-report').val()) {
      alert('신고사유를 입력해주세요');
      return;
    }

    await axios.post(
      `http://localhost:3000/api/posts/${postId}/reports`,
      { report_type: $('#report-type').val(), reported_reason: $('.input-report').val() },
      headers,
    );

    alert('해당 게시글을 신고했습니다');
    location.reload();
  } catch (error) {
    console.log(error.response);
    alert(error.response.data.errorMessage);
    location.reload();
  }
};
$(document).on('click', '.report-post-btn', async function () {
  await reportPost($(this).attr('post-id'));
});

// 게시글 삭제
const deletePost = async () => {
  try {
    await axios.delete(`http://localhost:3000/api/posts/${postId}`, headers);
    // location.reload();
  } catch (error) {
    console.log(error.response);
    alert(error.response.data.errorMessage);
    // location.reload();
  }
};
$(document).on('click', '.post-del-btn', function () {
  const isConfirmed = confirm('게시물을 정말로 삭제하시겠습니까?');
  deletePost($(this).attr('post-id'));
  // isConfirmed ? deletePost($(this).attr('post-id')) : location.reload();
});
