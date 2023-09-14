function loadContent(elementId, url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      document.getElementById(elementId).innerHTML = xhr.responseText;
    }
  };
  xhr.send();
}

window.onload = function () {
  loadContent('header', 'header.html');
  loadContent('footer', 'footer.html');
};

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

$(document).ready(function () {
  $('form').submit(async function (event) {
    event.preventDefault();

    const userConfirmed = confirm('게시글을 작성하시겠습니까?');

    if (userConfirmed) {
      const title = $('#title').val();
      const ingredient = $('#ingredient').val();
      const recipe = $('#recipe').val();
      const food_img = $('#food_img')[0].files[0];
      const hashtag = $('#hashtag').val();

      const formData = new FormData();
      formData.append('title', title);
      formData.append('ingredient', ingredient);
      formData.append('recipe', recipe);
      formData.append('food_img', food_img);
      formData.append('hashtag', hashtag);

      try {
        const response = await axios.post('http://localhost:3000/api/posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `${getCookie('WGID')}`,
          },
        });

        console.log('게시글 작성이 완료되었습니다.', response.data);

        window.location.href = '/myPost';
      } catch (error) {
        console.error('게시글 작성 중 오류가 발생했습니다.', error);
      }
    } else {
      console.log('게시글 작성이 취소되었습니다.');
    }
  });
});

function loadHashtags() {
  axios
    .get('/api/hashtags')
    .then(function (response) {
      const hashtagsData = response.data;
      const hashtags = hashtagsData.map((tagData) => tagData.hashtag); // hashtag 속성을 추출하여 배열로 변환
      const hashtagSelect = $('#hashtag');

      hashtags.forEach((tag) => {
        // 해시태그를 옵션으로 추가
        const option = $('<option>', {
          text: `#${tag}`,
          value: tag,
        });
        hashtagSelect.append(option);
      });
    })
    .catch(function (error) {
      console.error('해시태그를 불러오는 동안 오류가 발생했습니다.', error);
    });
}

$(document).ready(function () {
  loadHashtags(); // 페이지가 로드될 때 해시태그 목록을 불러옵니다.
});
