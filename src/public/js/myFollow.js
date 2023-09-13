let target;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/users/followers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `${getCookie('WGID')}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      // console.log(data);
      target = data.map((item) => item.targetId);
      user = data.map((item) => item.id);

      if (data == 0) {
        alert('팔로우한 게시물이 없습니다.');
      } else {
        const friendsPage = document.querySelector('.friends-page');

        data.forEach((item) => {
          const gridItem = document.createElement('div');
          gridItem.classList.add('grid-item', 'course', 'bg-white', 'rad-6', 'p-relative');

          gridItem.innerHTML = `
          <div class="friend bg-white rad-6 p-20 p-relative">
              <div class="txt-c">
                <img class="rad-half mt-10 mb-10 w-100 h-100" src="${item.user_img}" alt="" />
                <h4 class="m-0">${item.nickname}</h4>
                <p class="c-grey fs-13 mt-5 mb-0">${item.introduction}</p>
              </div>
              <div class="icons fs-14 p-relative">
                <div class="mb-10">
                  <span>${item.postCount}</span>
                </div>
              </div>
              <div class="info between-flex fs-13">
                <span class="c-grey">${item.created_at}</span>
                <div>
                  <a class="bg-red c-white btn-shape" href="#" id="unfollowBtn">팔로우 취소</a>
                </div>
              </div>
            </div>
        `;

          friendsPage.appendChild(gridItem);
        });
      }

      // const unfollowBtn = document.getElementById('unfollowBtn');

      // unfollowBtn.addEventListener('click', async () => {
      //   try {
      //     const response = await fetch(`/api/users/${userId}/unfollowers/${targetId}`, {
      //       method: 'DELETE',
      //       headers: {
      //         'Content-Type': 'application/json',
      //         authorization: `${getCookie('WGID')}`,
      //       },
      //       body: JSON.stringify({}),
      //     });

      //     if (response.ok) {
      //       alert('언팔로우 성공');
      //     } else {
      //       alert('언팔로우 실패');
      //     }
      //   } catch (error) {
      //     console.error(error);
      //   }
      // });
    }
  } catch (error) {
    console.error('Error:', error);
    alert(error);
  }
});

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
