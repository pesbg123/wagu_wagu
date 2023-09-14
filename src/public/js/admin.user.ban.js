/* eslint-disable no-undef */
$(document).ready(() => {
  let page = 1;
  getAllUsers(page);

  $(window).scroll(async function () {
    if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
      // 스크롤이 거의 하단에 도달했는지 확인
      page++;
      await getAllUsers(page); // 다음 페이지의 사용자들 불러오기
    }
  });
});

const headers = {
  headers: {
    'Content-Type': 'application/json',
    authorization: `${getCookie('WGID')}`,
  },
};

$('#go-back-index').click(() => {
  location.href = '/admin';
});

// 유저 조회
const getAllUsers = async (page) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/users?page=${page}`, headers);
    const users = response.data;

    let allHtml = '';

    if (users.length > 0) {
      response.data.forEach((item) => {
        allHtml += createUserRow(item);
      });

      page++;
    } else {
      $(window).off('scroll');
    }

    $('.user-list-body').append(allHtml);
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
            <td id="account-status" user-id="${item.id}" is-banned="${item['BannedUsers.id']}"><pre>${accountStatus}  ${statusSymbol}</pre></td>
            <td>${createdDateKST}</td>
            <td>${deletedDateKST}</td>
            <td><button type="submit" id="user-ban-btn" user-id="${item.id}" class="btn btn-dark create-btn ${createBanClass}">유저 밴</button>
            <button type="submit" id="delete-userBan-btn" banned-id="${item['BannedUsers.id']}" class="btn btn-secondary restore-btn ${restoreBanClass}">밴 취소</button>
            </td>
          </tr>`;
};

// 밴 사유 붙여주기
$(document).on('click', '#account-status', async function () {
  const userId = $(this).attr('user-id');
  const isBanned = $(this).attr('is-banned');
  if (isBanned === 'null') return;

  const response = await axios.get(`http://localhost:3000/api/bannedUsers/${userId}`, headers);
  const tempHtml = ` <p id="banned-reason-content" class="form-control input-height">
                      ${response.data.getBanHistoryByUser.banned_reason}
                     </p>`;
  $('.ban-reason-modal-body').html(tempHtml);

  $('#ban-reason-modal').modal('show');
});

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
    const response = await axios.post(`http://localhost:3000/api/bannedUsers/${user_id}`, { banned_reason: $('#banned-reason').val() }, headers);
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
    const response = await axios.delete(`http://localhost:3000/api/bannedUsers/${id}`, headers);

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
    let nickname = $('#search-input').val();
    const response = await axios.get(`http://localhost:3000/api/users/search?nickname=${nickname}`, headers);

    let allHtml = '';

    response.data.forEach((item) => {
      allHtml += createUserRow(item);
    });

    $('.user-list-body').html(allHtml);
  } catch (error) {
    console.log(error);
    alert(error.response.data.errorMessage);
  }
};
$('.search-btn').click(searchUser);
// 엔터 쳐도 버튼 이벤트 동작
$('#search-input').keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
    searchUser();
  }
});
