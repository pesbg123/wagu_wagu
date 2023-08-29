const blockListBtn = document.getElementById('block-list-btn');

blockListBtn.addEventListener('click', () => {
  location.href = '/admin_block_list';
});

const goBackIndexBtn = document.getElementById('go-back-index');

goBackIndexBtn.addEventListener('click', () => {
  location.href = '/admin_page';
});
