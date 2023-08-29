/* eslint-disable no-undef */
$(document).ready(function () {
  getHashtags();
  $('.cancel_btn').click(() => (location.href = '/admin_page'));
});

// input 요소에 포커스가 들어왔을 때 '#' 자동 추가
$('.hashtags_input').focus(function () {
  if (!$(this).val().startsWith('#')) {
    $(this).val('#' + $(this).val());
  }
});

// 해시테그 목록 조회
const getHashtags = async () => {
  try {
    const response = await axios.get('/api/hashtags');
    response.data.forEach((item) => {
      let temphtml = `<div class="hashtags_one">
                        <h5>${item.hashtag}</h5>
                        <div class="button-container">
                            <button class="edit-btn" hashtag-id="${item.id}">수정</button>
                            <button class="delete-btn" hashtag-id="${item.id}">삭제</button>
                        </div>
                    </div>`;
      $('.hashtags_list').append(temphtml);

      // 수정 버튼 클릭시 모달
      $('.edit-btn').click(function () {
        const hashtagId = $(this).attr('hashtag-id');
        $('#editModal').modal('show');
        $('#editModal .modal-footer').html(
          `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button><button class="save-btn" hashtag-id="${hashtagId}">저장</button>`,
        );

        $('#editedHashtag').focus(function () {
          if (!$(this).val().startsWith('#')) {
            $(this).val('#' + $(this).val());
          }
        });
      });
    });
  } catch (error) {
    alert(error.response.data.errorMessage);
  }
};

// 해시테그 저장
const createHashtag = async () => {
  try {
    const hashtag = $('#hashtag_input').val();
    if (hashtag === '#' || !hashtag || !hashtag.includes('#')) {
      alert('#으로 시작하는 해시테그를 입력해주세요.');
      return;
    }

    const response = await axios.post('/api/hashtags', { hashtag: $('#hashtag_input').val() });
    alert(response.data.message);
    location.reload();
  } catch (error) {
    alert(error.response.data.errorMessage);
  }
};
// 버튼 이벤트
$('#hashtag_btn').click(createHashtag);
// 엔터 쳐도 버튼 이벤트 동작
$('#hashtag_input').keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
    createHashtag();
  }
});

// 해시테그 삭제
const deleteHashtag = async (id) => {
  try {
    const response = await axios.delete(`/api/hashtags/${id}`);
    alert(response.data.message);
    location.reload();
  } catch (error) {
    alert(error.response.data.errorMessage);
  }
};
// 해시테그 삭제 이벤트 바인딩
$(document).on('click', '.delete-btn', function () {
  deleteHashtag($(this).attr('hashtag-id'));
});

// 해시테그 수정
const editHashtag = async (id) => {
  try {
    const hashtag = $('#editedHashtag').val();
    if (hashtag === '#' || !hashtag || !hashtag.includes('#')) {
      alert('#으로 시작하는 해시테그를 입력해주세요.');
      return;
    }

    const response = await axios.put(`/api/hashtags/${id}`, { hashtag: $('#editedHashtag').val() });
    alert(response.data.message);
    location.reload();
  } catch (error) {
    alert(error.response.data.errorMessage);
  }
};
// 해시테그 수정 이벤트 바인딩
$(document).on('click', '.save-btn', function () {
  editHashtag($(this).attr('hashtag-id'));
});

// 엔터 쳐도 버튼 이벤트 동작
$('#editedHashtag').keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
    editHashtag($('.save-btn').attr('hashtag-id'));
  }
});
