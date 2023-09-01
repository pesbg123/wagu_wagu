$(document).ready(function () {
  $('form').submit(async function (event) {
    event.preventDefault();

    const title = $('#recipeTitle').val();
    const ingredient = $('#ingredient').val();
    const recipe = $('#recipe').val();
    const imageFile = $('#recipeImage')[0].files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('ingredient', ingredient);
    formData.append('recipe', recipe);
    formData.append('image', imageFile);

    try {
      const response = await axios.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('게시글 작성이 완료되었습니다.', response.data);
    } catch (error) {
      console.error('게시글 작성 중 오류가 발생했습니다.', error);
    }
  });
});
