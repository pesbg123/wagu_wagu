document.addEventListener('DOMContentLoaded', async () => {
  const email = document.getElementById('email');
  const nicknameInput = document.getElementById('nicknameInput');
  const introductionInput = document.getElementById('introductionInput');
  const userImage = document.getElementById('userImage');
  const nmButton = document.getElementById('nmButton');
  const itButton = document.getElementById('itButton');
  const imageInput = document.getElementById('imageInput');
  const uploadImageButton = document.getElementById('uploadImageButton');
  const pwButton = document.getElementById('pwButton');
  const currentPwInput = document.getElementById('currentPwInput');
  const newPwInput = document.getElementById('newPwInput');

  try {
    const response = await fetch('/api/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();

      email.innerText = data.email;
      // nickname.innerText = data.nickname;
      nicknameInput.placeholder = data.nickname;
      if (!data.introduction) {
        introductionInput.placeholder = '소개글이 없습니다.';
      } else {
        introductionInput.placeholder = data.introduction;
      }
      userImage.src = data.user_img;

      // 닉네임 변경
      nmButton.addEventListener('click', async () => {
        try {
          const newNickname = nicknameInput.value;

          const response = await fetch('/api/profile/nickname', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              authorization: `${getCookie('WGID')}`,
            },
            body: JSON.stringify({ nickname: newNickname }),
          });

          if (response.ok) {
            nicknameInput.placeholder = newNickname;
            window.location.reload();
          }
        } catch (error) {
          console.error('닉네임 변경 오류:', error);
        }
      });

      // 소개 변경
      itButton.addEventListener('click', async () => {
        try {
          const newIntroduction = introductionInput.value;

          const response = await fetch('/api/profile/introduction', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ introduction: newIntroduction }),
          });

          if (response.ok) {
            introductionInput.placeholder = newIntroduction;
            window.location.reload();
          }
        } catch (error) {
          console.error('닉네임 변경 오류:', error);
        }
      });

      // 이미지 업로드 버튼 클릭 이벤트
      uploadImageButton.addEventListener('click', () => {
        imageInput.click();
      });

      // 이미지 업로드
      imageInput.addEventListener('change', async () => {
        const selectedImage = imageInput.files[0];

        if (selectedImage) {
          const formData = new FormData();
          formData.append('userImage', selectedImage);

          try {
            const response = await fetch('api/profile/userimg', {
              method: 'PATCH',
              body: formData,
            });

            if (response.ok) {
              const data = await response.json();
              userImage.src = data.imageUrl;
              window.location.reload();
            } else {
              alert('이미지 업로드 실패.');
              window.location.reload();
            }
          } catch (error) {
            console.error('이미지 업로드 오류:', error);
            alert('이미지 업로드 중 오류가 발생했습니다.');
          }
        }
      });

      pwButton.addEventListener('click', async () => {
        try {
          const currentPw = currentPwInput.value;
          const newPw = newPwInput.value;

          const response = await fetch('api/profile/password', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currentPw, newPw }),
          });

          if (response.ok) {
            alert('비밀번호이 변경되었습니다. 다시 로그인해주세요.');
            deleteCookie('WGID');
            window.location.href = '/';
          } else {
            const errorData = await response.json();
            alert(`오류: ${errorData.message}`);
          }
        } catch (error) {
          console.error('비밀번호 변경 오류:', error);
          alert('비밀번호 변경 중 오류가 발생했습니다.');
        }
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

// 쿠키에서 특정 이름의 쿠키 값을 가져오는 함수
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

//쿠키삭제
function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const chPwBtn = document.getElementById('chPwBtn');
chPwBtn.addEventListener('click', function () {
  chPwBtn.style.display = 'none';
  const pwForm = document.getElementById('pwForm');
  const pwButton = document.getElementById('pwButton');
  pwForm.style.display = 'block';
  pwButton.style.display = 'block';
  document.getElementById('currentPwInput').focus();
});
