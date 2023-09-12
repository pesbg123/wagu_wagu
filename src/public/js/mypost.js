
// 특정 박스에 게시글 정보를 로드하는 함수
function loadPostIntoBox(boxId, post) {
  const box = document.getElementById(boxId);

  // 이미지 로드
  const image = new Image();
  image.src = post.food_img;
  image.className = 'box-image';
  box.appendChild(image);

  // 제목 추가
  const titleElement = document.createElement('h2');
  titleElement.textContent = post.title;
  box.appendChild(titleElement);

  // 내용 추가 (레시피)
  const contentElement = document.createElement('p');
  contentElement.textContent = post.recipe;
  box.appendChild(contentElement);
}

// 게시글을 가져와 박스에 로드하는 함수
async function loadPosts() {
  try {
    const response = await axios.get('/posts'); // 엔드포인트 변경

    response.data.forEach((post, index) => {
      loadPostIntoBox(`box${index + 1}`, post);
    });
  } catch (error) {
    console.error(`Error loading posts: ${error}`);
  }
}

window.addEventListener('load', loadPosts);
