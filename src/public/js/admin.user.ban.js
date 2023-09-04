/* eslint-disable no-undef */
$(document).ready(() => {
  getAllUsers();
});

$('#go-back-index').click(() => {
  location.href = '/admin';
});

// 유저 조회
const getAllUsers = async () => {
  try {
    const response = await axios.get('/api/users');

    let allHtml = '';

    response.data.forEach((item) => {
      console.log(item);

      allHtml += createUserRow(item);
    });
    $('.user-list-body').html(allHtml);
  } catch (error) {
    console.error(error);
  }
};

// 유저 데이터 붙이는 함수
const createUserRow = (item) => {
  const { accountStatus, statusSymbol, deletedDateKST } = getUserStatus(item);
  const createdDateKST = convertToKST(item.created_at);
  let createBanClass = '';
  let restoreBanClass = '';

  if (accountStatus === '활성화') {
    createBanClass = 'show-create-ban-btn';
  } else if (accountStatus === '비활성화(밴)') {
    restoreBanClass = 'show-restore-ban-btn';
  }
  return `<tr>
            <td>${item.nickname}</td>
            <td>${item.email}</td>
            <td><pre>${accountStatus}  ${statusSymbol}</pre></td>
            <td>${createdDateKST}</td>
            <td>${deletedDateKST}</td>
            <td><button type="submit" id="user-ban-btn" user-id="${item.id}" class="btn btn-dark create-btn ${createBanClass}">유저 밴</button>
            <button type="submit" id="delete-userBan-btn" banned-id="${item['BannedUsers.id']}" class="btn btn-secondary restore-btn ${restoreBanClass}">밴 취소</button>
            </td>
          </tr>`;
};

// 계정 상태 나눠주는 함수
const getUserStatus = (item) => {
  if (item.deleted_at) {
    return {
      accountStatus: '탈퇴',
      statusSymbol: '⚫️',
      deletedDateKST: convertToKST(item.deleted_at),
    };
  }

  if (item['BannedUsers.id']) {
    return {
      accountStatus: '비활성화(밴)',
      statusSymbol: '🔴',
      deletedDateKST: '해당 없음',
    };
  }

  return {
    accountStatus: '활성화',
    statusSymbol: '🟢',
    deletedDateKST: '해당 없음',
  };
};

// 한국 시간으로 변환하는 함수
const convertToKST = (dateUTCString) => {
  const dateUTC = new Date(dateUTCString);
  return dateUTC.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
};

// 유저 밴
const createBanUser = async (user_id) => {
  try {
    const response = await axios.post(`/api/bannedUsers/${user_id}`, { banned_reason: $('#banned-reason').val() });
    alert(response.data.message);
    location.reload();
  } catch (error) {
    console.log(error);
    alert(error.response.data.errorMessage);
  }
};
$(document).on('click', '.save-btn', function () {
  createBanUser($(this).attr('user-id'));
});
$(document).on('click', '#user-ban-btn', function () {
  const userId = $(this).attr('user-id');

  $('#ban-modal').modal('show');
  $('#ban-modal .modal-footer').html(
    ` <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
      <button type="submit" class="btn btn-dark save-btn" user-id=${userId}>유저 밴</button>`,
  );
});

// 밴 취소
const deleteBanUser = async (id) => {
  try {
    const response = await axios.delete(`/api/bannedUsers/${id}`);

    alert(response.data.message);
    location.reload();
  } catch (error) {
    console.log(error);
    alert(error.response.data.errorMessage);
  }
};
$(document).on('click', '.restore-btn', function () {
  deleteBanUser($(this).attr('banned-id'));
});

// 유저 검색
const searchUser = async () => {
  try {
    const nickname = $('#search-input').val();
    const response = await axios.get(`/api/users/search?nickname=${nickname}`);
    console.log($('#search-input').val());
    console.log(response);

    // let allHtml = '';

    // response.data.forEach((item) => {
    //   allHtml += createUserRow(item);
    // });
    // $('.user-list-body').html(allHtml);
  } catch (error) {
    console.log(error);
    alert(error.response.data.errorMessage);
  }
};
$('.search-btn').click(searchUser);
