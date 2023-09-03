/* eslint-disable no-undef */
$(document).ready(() => {
  getAllUsers();
});

// 유저 조회
const getAllUsers = async () => {
  try {
    const response = await axios.get('/api/users');

    let allHtml = '';

    response.data.forEach((item) => {
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
            <button type="submit" id="delete-userBan-btn" user-id="${item.id}" class="btn btn-secondary restore-btn ${restoreBanClass}">밴 취소</button>
            </td>
          </tr>`;
};

// 계정 상태 나눠주는 함수
const getUserStatus = (item) => {
  console.log(item);

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
      deletedDateKST: convertToKST(item['BannedUsers.created_at']),
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

// 밴 유저 조회
// const getBannedUsers = async () => {
//   try {
//     const response = await axios.get('/api/bannedUsers');
//     console.log(response);

//     let allHtml = '';
//     response.data.forEach((item) => {
//       const bannedDateUTC = new Date(item.created_at);
//       const bannedDateKST = bannedDateUTC.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
//       let temphtml = `<tr>
//                           <td>${item['User.nickname']}</td>
//                           <td>${item['User.email']}</td>
//                           <td>${item.banned_reason}</td>
//                           <td>${bannedDateKST}</td>
//                           <td><button type="submit" id="delete-userBan-btn" class="btn  btn-dark" banned-id="${item.id}">밴 취소</button></td>
//                       </tr>`;
//       allHtml += temphtml;
//     });
//     $('.banUser-list-body').html(allHtml);
//   } catch (error) {
//     console.error(error);
//   }
// };

// 유저 밴
const createBanUser = async (user_id) => {
  try {
    const response = await axios.post(`/api/bannedUsers/${user_id}`, { banned_reason: $('#banned-reason').val() });
    alert(response.data.message);
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
// const deleteBanUser = async (id) => {
//   try {
//     const response = await axios.delete(`/api/bannedUsers/${id}`);

//     alert(response.data.message);
//     location.reload();
//   } catch (error) {
//     console.log(error);
//     alert(error.response.data.errorMessage);
//   }
// };
// $(document).on('click', '#delete-userBan-btn', function () {
//   deleteBanUser($(this).attr('banned-id'));
// });
