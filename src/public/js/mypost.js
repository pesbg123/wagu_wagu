document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/posts/mypost', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `${getCookie('WGID')}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const coursesPage = document.querySelector('.courses-page');

      data.forEach((item) => {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item', 'course', 'bg-white', 'rad-6', 'p-relative');

        gridItem.innerHTML = `
            <img class="cover" id="post-img" post-id="${item.id}" src="${item.food_img}" alt="" />
            <div class="p-10">
              <h4 class="m-0">${item.title}</h4>
              <p class="description c-grey mt-15 fs-14">${item.ingredient}</p>
            </div>
            <div class="info p-10 p-relative between-flex">
              <span class="c-grey">${item.created_at.substring(0, 10)}</span>
              <span class="c-grey">${item.like}</span>
            </div>
          `;

        coursesPage.appendChild(gridItem);
      });
    } else {
      alert('작성한 게시물이 없습니다.');
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
