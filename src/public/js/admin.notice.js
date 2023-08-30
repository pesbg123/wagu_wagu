/* eslint-disable no-undef */
$(document).ready(function () {
  getAdminNotices();
});
$('.cancel_btn').click(() => (location.href = '/admin'));

// 공지 목록 조회
const getAdminNotices = async () => {
  try {
    const response = await axios.get('/api/admin/adminNotices');

    let allHtml = '';
    response.data.forEach((item) => {
      // deleted_at이 존재하면 클래스 추가
      let textColorClass = item.deleted_at ? 'notice-content' : '';
      let btnHiddenClass = item.deleted_at ? 'btn-hidden' : '';
      let btnShowClass = item.deleted_at ? 'btn-show' : '';

      let temphtml = `<div class="notices_one">
                        <h5 class="text ${textColorClass}">${item.content}</h5>
                        <div class="button-container">
                          <button class="edit-btn ${btnHiddenClass}" data-original="${item.content}" notice-id="${item.id}">수정</button>
                            <button class="del-btn ${btnHiddenClass}" notice-id="${item.id}">삭제</button>
                              <button class="hard-del-btn ${btnShowClass}" notice-id="${item.id}">영구삭제</button>
                          </div>
                      </div>`;
      allHtml += temphtml;
    });
    $('.notices_list').html(allHtml);
  } catch (error) {
    alert(error.response.data.errorMessage);
  }
};
// 수정 버튼 클릭시 모달
$(document).on('click', '.edit-btn', function () {
  const noticeId = $(this).attr('notice-id');
  const originalContent = $(this).data('original'); // 원본 내용 가져오기

  $('#editedNotice').val(originalContent); // 인풋창 값 변경
  $('#editModal').modal('show');
  $('#editModal .modal-footer').html(
    ` <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button><button class="save-btn" notice-id="${noticeId}">저장</button>`,
  );
});

// 공지 등록
const createAdminNotice = async () => {
  try {
    if (!$('.notices_input').val()) {
      alert('공지 내용을 입력해주세요.');
      return;
    }
    const response = await axios.post('/api/adminNotices', { content: $('.notices_input').val() });
    alert(response.data.message);
    location.reload();
  } catch (error) {
    alert(error.response.data.errorMessage);
  }
};
$('.write_btn').click(createAdminNotice);

// 공지 수정
const editAdminNotice = async (id) => {
  try {
    const editedNotice = $('#editedNotice').val();
    if (!editedNotice) {
      alert('수정할 공지 내용을 입력해주세요.');
    }
    const response = await axios.put(`/api/adminNotices/${id}`, { content: editedNotice });
    alert(response.data.message);
    location.reload();
  } catch (error) {
    alert(error.response.data.errorMessage);
  }
};
$(document).on('click', '.save-btn', function () {
  editAdminNotice($(this).attr('notice-id'));
});

// 공지 삭제 (soft delete)
const deleteAdminNotice = async (id) => {
  try {
    const response = await axios.delete(`/api/adminNotices/${id}`);
    alert(response.data.message);
    location.reload();
  } catch (error) {
    alert(error.response.data.errorMessage);
  }
};
$(document).on('click', '.del-btn', function () {
  deleteAdminNotice($(this).attr('notice-id'));
});

// 공지 영구 삭제 (hard delete)
const hardDeleteAdminNotice = async (id) => {
  try {
    const response = await axios.delete(`/api/adminNotices/${id}/delete`);
    alert(response.data.message);
    location.reload();
  } catch (error) {
    alert(error.response.data.errorMessage);
  }
};
$(document).on('click', '.hard-del-btn', function () {
  hardDeleteAdminNotice($(this).attr('notice-id'));
});
