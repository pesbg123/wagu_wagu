/* eslint-disable no-undef */
let postId;
let userId;

const headers = {
  headers: {
    'Content-Type': 'application/json',
    authorization: `${getCookie('WGID')}`,
  },
};

$(document).ready(() => {
  const url = new URL(window.location.href);
  console.log(url);
  postId = url.pathname.split('/')[2];
  getPost();
  getComment();

  $(document).on('click', '#likeBtn', async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `${getCookie('WGID')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        window.location.reload();
      } else {
        const data = await response.json();
      }
    } catch (error) {
      console.log(error);
    }
  });

  $(document).on('click', '#followBtn', async () => {
    try {
      const response = await fetch(`/api/users/${userId}/followers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `${getCookie('WGID')}`,
        },
        body: JSON.stringify({
          target_id: userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        $('#followBtn').hide();

        // location.reload();
      } else {
        const data = await response.json();
      }
    } catch (error) {
      console.log(error);
    }
  });
});

// 한국 시간으로 변환하는 함수
const convertToKST = (dateUTCString) => {
  const dateUTC = new Date(dateUTCString);
  return dateUTC.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
};

const getPost = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/posts/${postId}`, headers);
    console.log(response);

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
                          <button id="likeBtn">❤️ ${response.data.data.like}</button>
                        </div>
                        </section>`;

    $('.one-post').html(tempHtml);

    userId = response.data.data['User.id'];

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
                    ${`<button id="followBtn">팔로우</button>`}
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
    comment.forEach((item) => {
      if (item.reply_id === null) {
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
  // 게시글 수정 모달 열기
  $('#editPostModal').modal('show');

  // 수정 버튼 클릭 시 게시글 업데이트 이벤트 연결
  $('#updatePost')
    .off('click')
    .on('click', async function (event) {
      event.preventDefault();

      const userConfirmed = confirm('게시글을 수정하시겠습니까?');

      if (userConfirmed) {
        const title = $('#title').val();
        const ingredient = $('#ingredient').val();
        const recipe = $('#recipe').val();
        const food_img = $('#food_img')[0].files[0];

        const formData = new FormData();
        formData.append('title', title);
        formData.append('ingredient', ingredient);
        formData.append('recipe', recipe);
        formData.append('food_img', food_img);

        try {
          const response = await axios.patch(`http://localhost:3000/api/posts/${postId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              authorization: `${getCookie('WGID')}`,
            },
          });

          console.log('게시글 수정이 완료되었습니다.', response.data);

          // 모달 닫기
          $('#editPostModal').modal('hide');

          // 페이지 다시 로드 또는 필요한 처리를 수행할 수 있습니다.
          window.location.reload();
        } catch (error) {
          console.error('게시글 수정 중 오류가 발생했습니다.', error);
        }
      } else {
        console.log('게시글 수정이 취소되었습니다.');
      }
    });
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
    location.reload();
  } catch (error) {
    console.log(error.response);
    alert(error.response.data.errorMessage);
    location.reload();
  }
};
$(document).on('click', '.post-del-btn', function () {
  const isConfirmed = confirm('게시물을 정말로 삭제하시겠습니까?');
  isConfirmed ? deletePost($(this).attr('post-id')) : location.reload();
});
