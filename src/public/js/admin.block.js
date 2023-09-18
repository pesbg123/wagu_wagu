/* eslint-disable no-undef */
$(document).ready(() => {
  getBlockPost();
  getBlockComments();
});

const headers = {
  headers: {
    'Content-Type': 'application/json',
  },
};

$('#go-back-reports').click(() => (location.href = '/admin'));

// 블락 게시글 조회
const getBlockPost = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/posts', headers);

    let allHtml = '';
    response.data.data.forEach((item) => {
      if (item.is_blocked) {
        let temphtml = `<tr>
                            <td>${item.User.nickname}</td>
                            <td><a href="#">${item.title}</a></td>
                            <td>3번 이상 신고를 받은 게시물 </td>
                            <td> <button type="submit" id="post-unblock-btn" class="btn btn-dark" post-id="${item.id}">블락 취소</button></td>
                        </tr>`;
        allHtml += temphtml;
      }
    });
    $('.block-posts').html(allHtml);
  } catch (error) {
    console.error(error);
  }
};

// 블락 댓글 조회
const getBlockComments = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/comments', headers);
    let allHtml = '';
    response.data.data.forEach((item) => {
      if (item.is_blocked) {
        let temphtml = `<tr>
                            <td>${item.User.nickname}</td>
                            <td><a href="#">${item.Post.title}</a></td>
                            <td>${item.content}</td>
                            <td>3번 이상 신고를 받은 게시물 </td>
                            <td> <button type="submit" id="comment-unblock-btn" class="btn btn-dark" comment-id="${item.id}" post-id="${item.Post.id}">블락 취소</button></td>
                        </tr>`;
        allHtml += temphtml;
      }
    });
    $('.block-comments').html(allHtml);
  } catch (error) {
    console.error(error);
  }
};

// 게시물 블락 취소
const restorePost = async (id) => {
  try {
    const response = await axios.patch(`http://localhost:3000/api/posts/${id}/unblock`, headers);
    alert(response.data.message);
    location.reload();
  } catch (error) {
    console.error(error);
    alert(error.response.data.errorMessage);
  }
};
$(document).on('click', '#post-unblock-btn', function () {
  const postId = $(this).attr('post-id');
  restorePost(postId);
});

// 댓글 블락 취소
const restoreComment = async (postId, commentId) => {
  try {
    const response = await axios.patch(`http://localhost:3000/api/posts/${postId}/comments/${commentId}/unblock`, headers);
    alert(response.data.message);
    location.reload();
  } catch (error) {
    console.error(error);
    alert(error.response.data.errorMessage);
  }
};
$(document).on('click', '#comment-unblock-btn', function () {
  const postId = $(this).attr('post-id');
  const commentId = $(this).attr('comment-id');
  restoreComment(postId, commentId);
});

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
