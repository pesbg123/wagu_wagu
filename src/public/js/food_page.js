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
                            <button style="border: none; post-id="${response.data.data.id}"  margin-bottom: 5px;">신고</button>
                            <button style="border: none; post-id="${response.data.data.id}"  margin-bottom: 5px;">수정</button>
                            <button style="border: none; post-id="${response.data.data.id}" margin-bottom: 5px;">삭제</button>
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
    console.log(comment);

    let allComment = '';
    let replyComment = '';
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
                              <button comment-id="" style="border: none; margin-top: 5px;">답글</button>
                              <button comment-id="" style="border: none; margin-top: 5px;">신고</button>
                              <button comment-id="" style="border: none; margin-top: 5px;">수정</button>
                              <button comment-id="" style="border: none; margin-top: 5px;">삭제</button>
                            </div>
                            <!-- Child comment 1-->
                            <div class="d-flex mt-4 reply-comment" id="reply-comment" comment-id="${item.id}" style="margin-left: 4rem;">
                            </div>
                          </div>

                        </div>`;
        allComment += temphtml;
      }
      // } else {
      //   let temphtml = `<div class="one-reply">
      //                         <div class="flex-shrink-0"><img class="rounded-circle"
      //                             src="${item.User.user_img}" alt="..." /></div>
      //                         <div class="ms-3">
      //                           <div class="fw-bold">${item.User.nickname}</div>
      //                           <div>${item.content}</div>
      //                           <button style="border: none; margin-top: 5px;">답글</button>
      //                           <button style="border: none; margin-top: 5px;">신고</button>
      //                           <button style="border: none; margin-top: 5px;">수정</button>
      //                           <button style="border: none; margin-top: 5px;">삭제</button>
      //                         </div>
      //                       </div>`;
      //   replyComment += temphtml;
      //   console.log(replyComment);
      //   $(`.reply-comment`).html(replyComment);
      // }
    });

    $('.comment-card').html(allComment);
  } catch (error) {
    console.log(error);
  }
};

// const getReplyComment = async () => {
//   try {
//     const response = await axios.get(`http://localhost:3000/api/post/${postId}/comments/160`);
//     // const replyComment = response.data.data;
//     console.log(response);

//     // replyComment.forEach((item) => {
//     //   if (item.reply_id) {
//     //   }
//     // });
//   } catch (error) {
//     console.log(error);
//   }
// };

// 댓글 생성
const createComment = async () => {
  try {
    if (!$('#comment-input').val()) {
      alert('댓글을 입력해주세요.');
      return;
    }
    await axios.post(`http://localhost:3000/api/comments/${postId}`, { content: $('#comment-input').val() });

    alert('댓글이 작성되었습니다.');
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
// $(document).on('click', '.edit-btn', function () {
//   const noticeId = $(this).attr('notice-id');

//   const originalContent = $(this).data('original'); // 원본 내용 가져오기

//   $('#editedNotice').val(originalContent); // 인풋창 값 변경
//   $('#editModal').modal('show');
//   $('#editModal .modal-footer').html(
//     ` <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button><button type="submit" notice-id="${noticeId}" class="btn btn-dark save-btn">수정</button>`,
//   );
// });
