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
      console.log(data);

      if (!data) {
        alert('팔로우한 게시물이 없습니다.');
      }
      // else {
      //   const coursesPage = document.querySelector('.courses-page');

      //   list.forEach((item) => {
      //     const gridItem = document.createElement('div');
      //     gridItem.classList.add('grid-item', 'course', 'bg-white', 'rad-6', 'p-relative');

      //     gridItem.innerHTML = `
      //     <div class="friend bg-white rad-6 p-20 p-relative">
      //         <div class="txt-c">
      //           <img class="rad-half mt-10 mb-10 w-100 h-100" src="#" alt="" />
      //           <h4 class="m-0">닉네임</h4>
      //           <p class="c-grey fs-13 mt-5 mb-0">소개</p>
      //         </div>
      //         <div class="icons fs-14 p-relative">
      //           <div class="mb-10">
      //             <span>작성한 게시물 개수</span>
      //           </div>
      //         </div>
      //         <div class="info between-flex fs-13">
      //           <span class="c-grey">팔로우 날짜</span>
      //           <div>
      //             <a class="bg-red c-white btn-shape" href="#">팔로우 취소</a>
      //           </div>
      //         </div>
      //       </div>
      //   `;

      //     coursesPage.appendChild(gridItem);
      //   });
      // }
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
