/* eslint-disable no-undef */
const headers = {
  headers: {
    'Content-Type': 'application/json',
    authorization: `${getCookie('WGID')}`,
  },
};

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

$(document).ready(() => {
  getUser();
});

const getUser = async () => {
  const response = await axios.get(`http://localhost:3000/api/user`, headers);
  console.log(response);
};
// const getUserInfo = async () => {
//   try {
//     return response.data;
//   } catch (error) {
//     console.error(error);
//   }
// };

// $(document).ready(async () => {
//   // URL을 가변적으로 변경하기 위해.
//   const urlPath = window.location.pathname;
//   const pathSegments = urlPath.split('/');

//   // 게시글 ID
//   const post_id = pathSegments[2];

//   // 로그인한 사용자 정보 가져오기
//   const userInfo = await getUserInfo();

//   if (!userInfo || !post_id) {
//     console.error('Invalid user info or post ID');
//     return;
//   }

//   // 로그인한 사용자의 아이디
//   const loggedInUserId = userInfo.id;

//   getPosts(post_id, loggedInUserId);

//   $('#submitCommentBtn').click(() => {
//     submitComment(post_id); // post_id 전달
//   });
// });

// const getPosts = async (post_id, loggedInUserId) => {
//   try {
//     const response = await axios.get(`http://localhost:3000/api/posts/${post_id}`, headers);

//     let tempHtml = `<div class="resume-section-content">
//                         <h2 class="mb-5">${response.data.data.title}`;

//     // 사용자 user_id와 포스트의 작성자 user_id가 일치하지 않을 경우에만 게시글 신고 버튼 표시
//     if (loggedInUserId !== response.data.data.user_id) {
//       tempHtml += `<button class="reportPostBtn" data-post-id="${response.data.data.id}">게시글 신고</button>`;
//     }

//     tempHtml += `</h2>
//                   <div class="d-flex flex-column flex-md-row justify-content-between mb-5">
//                     <div class="flex-grow-1">
//                       <h3 class="mb-0">재료 목록</h3>
//                       <p>
//                         ${response.data.data.ingredient}
//                       </p>
//                     </div>
//                   </div>
//                   <div class="d-flex flex-column flex-md-row justify-content-between">
//                     <div class="flex-grow-1">
//                       <div class="subheading mb-3">조리법</div>
//                       <p>${response.data.data.recipe}</p>`;

//     // 이미지 요소.
//     if (response.data.data.food_img) {
//       console.log(`이미지 경로가 있을 시 : ${response.data.data.food_img}`); // 콘솔 로그 수정
//       tempHtml += `<img src="${response.data.data.food_img}" alt="${response.data.title}" />`;
//     } else {
//       console.log('이미지 경로가 없을 시'); // 이미지 경로가 없을 경우에 대한 콘솔 로그 추가
//     }

//     tempHtml += `</div>
//                   </div>`;

//     tempHtml += '</br></br>';

//     $('.posts').html(tempHtml);
//   } catch (error) {
//     console.error(error);
//   }
// };

// //댓글 신고.
// const reportPost = async (post_id) => {
//   try {
//     await axios.patch(`http://localhost:3000/api/posts/${post_id}/block`, headers);
//     alert('게시글이 신고되었습니다.');
//   } catch (error) {
//     console.error(error);
//   }
// };

// $(document).on('click', '.reportPostBtn', function () {
//   const post_id = $(this).data('post-id');
//   reportPost(post_id);
// });

// //댓글 조회
// const getComments = async (post_id, loggedInUserId) => {
//   try {
//     const response = await axios.get(`http://localhost:3000/api/comments/${post_id}`, headers);
//     let allHtml = '';

//     if (response.data.data.length === 0) {
//       // 만약 댓글이 없다면
//       allHtml = '<p>아직 등록된 댓글이 없습니다.</p>';
//     } else {
//       response.data.data.forEach((comment) => {
//         let tempHtml = `<div class="${comment.reply_id ? 'reply-comment' : 'original-comment'}">
//                   <p id="postCommentContent_${comment.id}">
//                   ${comment.content}
//                   </p>`;

//         // 로그인한 사용자와 댓글 작성자의 user_id 비교, 닉네임 가져오도록 수정.
//         if (loggedInUserId === comment.user_id) {
//           // <-- 여기서 변경됨
//           // 사용자가 댓글 작성자인 경우 수정, 삭제, 대댓글 버튼 보이기
//           tempHtml += `
//             <button id="editCommentBtn_${comment.id}" class="edit-button">수정</button>
//             <button id="deleteCommentBtn_${comment.id}" class="delete-button">삭제</button>
//             <button id="replyCommentBtn_${comment.id}" data-post-id="${comment.post_id}" data-comment-id="${comment.reply_id}">대댓글 작성</button>
//           `;
//         } else {
//           // 사용자가 댓글 작성자가 아닌 경우 신고, 대댓글 버튼 보이기
//           tempHtml += `
//             <button class="report-button" data-post-id="${post_id}" data-comment-id="${comment.id}">신고123</button>
//             <button id="replyCommentBtn_${comment.id}" data-post-id="${comment.post_id}" data-comment-id="${comment.reply_id}">대댓글 작성</button>
//           `;
//         }

//         tempHtml += '</div><br></br>';
//         allHtml += tempHtml;
//       });
//     }

//     $('.comments-container').html(allHtml);
//   } catch (error) {
//     console.error(error);
//   }
// };

// $(document).on('click', '[id^=deleteCommentBtn_]', function () {
//   const comment_id = this.id.split('_')[1];
//   if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
//     deleteComment(comment_id);
//   }
// });

// const deleteComment = async (comment_id) => {
//   try {
//     await axios.delete(`http://localhost:3000/api/comments/${comment_id}`, headers);
//     $(`#postCommentContent_${comment_id}`).parent().remove();
//     alert('댓글이 성공적으로 삭제되었습니다.');
//   } catch (error) {
//     console.error(error);
//   }
// };

// const editComment = async (comment_id, newContent) => {
//   try {
//     await axios.put(
//       `http://localhost:3000/api/comments/${comment_id}`,
//       {
//         content: newContent,
//       },
//       headers,
//     );

//     $(`#postCommentContent_${comment_id}`).text(newContent);

//     alert('댓글이 성공적으로 수정되었습니다.');
//   } catch (error) {
//     console.error(error);
//   }
// };
// $(document).on('click', '[id^=editCommentBtn_]', function () {
//   const comment_id = this.id.split('_')[1];
//   const newContent = prompt('댓글을 수정하세요.');

//   if (newContent !== null && newContent.trim() !== '') {
//     editComment(comment_id, newContent);
//   }
// });

// // 댓글 제출
// const submitComment = async (post_id) => {
//   try {
//     const commentText = $('#commentText').val();

//     if (!commentText.trim()) {
//       alert('댓글 내용을 입력해주세요.');
//       return;
//     }

//     await axios.post(
//       `/http://localhost:3000/api/comments/${post_id}`,
//       {
//         content: commentText,
//         post_id: post_id,
//         reply_id: null,
//       },
//       headers,
//     );

//     $('#commentText').val('');
//     getComments(loggedInUserId);

//     // 확인용 모달창
//     $('#commentModal').modal('show');
//   } catch (error) {
//     console.error(error);
//   }
//   // 자동 새로고침
//   getComments(loggedInUserId);
// };

// // 댓글 신고
// const reportComment = async (post_id, comment_id) => {
//   try {
//     await axios.patch(`http://localhost:3000/api/posts/${post_id}/comments/${comment_id}/block`, headers);
//     alert('댓글이 성공적으로 신고되었습니다.');
//     getComments(loggedInUserId); // 화면에서 바로 변경사항 반영
//   } catch (error) {
//     console.error(error);
//   }
// };

// $(document).on('click', '.report-button', function () {
//   const post_id = $(this).data('post-id');
//   const comment_id = $(this).data('comment-id');

//   if (confirm('정말로 이 댓글을 신고하시겠습니까?')) {
//     reportComment(post_id, comment_id);
//   }
// });

// //대댓글 작성
// const submitReplyComment = async (post_id, reply_id) => {
//   try {
//     const commentText = $('#replyCommentText').val();

//     if (!commentText.trim()) {
//       alert('대댓글 내용을 입력해주세요.');
//       return;
//     }

//     console.log(`post_id=${post_id}, reply_id=${reply_id}, content=${commentText}`);

//     const response = await axios.post(
//       `http://localhost:3000/api/comments/${post_id}`,
//       {
//         content: commentText,
//         reply_id: reply_id, // 대댓글의 ID를 reply_id로 전달
//       },
//       headers,
//     );

//     console.log(`Response from server: ${JSON.stringify(response.data)}`);

//     $('#replyCommentText').val('');

//     // 확인용 모달창
//     $('#commentModal').modal('show');
//   } catch (error) {
//     console.error(error);
//   }

//   // 자동 새로고침
//   getComments(loggedInUserId);

//   // 대댓글 작성이 완료되면 대댓글 작성 모달창 닫기
//   $('#replyModal').modal('hide');
// };

// // 이벤트 핸들러 등록 - 대댓글 작성 버튼 클릭 시 동작
// $(document).on('click', '[id^=replyCommentBtn_]', function () {
//   const post_id = $(this).data('post-id'); // post_id 가져오기
//   const reply_id = $(this).data('comment-id'); // 부모 댓글의 id 가져오기, 여기서 수정.
//   //console.log($(this). $(this).data('comment-id'))

//   // 대댓글 작성 모달창 띄우기
//   $('#replyModal').modal('show');

//   // 대댓글 제출 버튼에 이벤트 핸들러 추가
//   $('#submitReplyBtn')
//     .off()
//     .click(() => {
//       submitReplyComment(post_id, reply_id); // post_id와 reply_id를 올바르게 전달
//     });
// });

// //안될 시 헤더와 http//localohost, 초기에 선언된 함수 삭제해보기.
