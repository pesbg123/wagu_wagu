/* eslint-disable no-undef */
$('#notice-btn').click(() => (location.href = '/admin/notices'));
$('#hashtag-btn').click(() => (location.href = '/admin/hashtags'));
$('#report-btn').click(() => (location.href = '/admin/reports'));
$('#user-ban-btn').click(() => (location.href = '/admin/user_ban'));
$('#block-list-btn').click(() => (location.href = '/admin/block_list'));

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/dashboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();

      // console.log('🚀 ~ file: admin.index.js:20 ~ document.addEventListener ~ data:', data.Data);

      const { hashtagCounts } = data.Data;

      function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

      // 해시태그와 색상 정보를 담을 배열
      const dataForChart = [];

      // 해시태그를 순회하면서 색상을 랜덤하게 생성하여 데이터 배열에 추가
      for (const hashtag in hashtagCounts) {
        if (hashtagCounts.hasOwnProperty(hashtag)) {
          const count = hashtagCounts[hashtag];
          const color = getRandomColor();
          dataForChart.push({ label: hashtag, count, color });
        }
      }

      // 캔버스 요소 가져오기
      const canvas = document.getElementById('donutChart');
      const ctx = canvas.getContext('2d');

      // 데이터
      const tagData = {
        labels: dataForChart.map((item) => item.label),
        datasets: [
          {
            data: dataForChart.map((item) => item.count),
            backgroundColor: dataForChart.map((item) => item.color),
          },
        ],
      };

      // 옵션
      const donutoptions = {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      };

      // 도넛 차트 생성
      const myDonutChart = new Chart(ctx, {
        type: 'doughnut',
        data: tagData,
        options: donutoptions,
      });

      // 캔버스 요소 가져오기
      const usersCanvas = document.getElementById('usersChart');
      const usersCtx = usersCanvas.getContext('2d');

      // 데이터
      const usersData = {
        labels: ['Last Week', 'This Week', 'Today'],
        datasets: [
          {
            label: 'Users Created',
            // data: [data.Data.usersCreatedLastWeek, data.Data.usersCreatedThisWeek, data.Data.usersCreatedToday],
            data: [4100, 3500, 1250],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)', // Last Month - Red
              'rgba(54, 162, 235, 0.5)', // Last Week - Blue
              'rgba(255, 206, 86, 0.5)', // Today - Yellow
            ],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
            borderWidth: 1,
          },
        ],
      };

      // 옵션
      const usersOptions = {
        responsive: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };

      // 막대 그래프 생성
      const usersBarChart = new Chart(usersCtx, {
        type: 'bar',
        data: usersData,
        options: usersOptions,
      });

      // 막대 그래프 생성
      const postsCanvas = document.getElementById('postsChart');
      const postsCtx = postsCanvas.getContext('2d');

      const postsData = {
        labels: ['Last Week', 'This Week', 'Yesterday', 'Today'],
        datasets: [
          {
            label: 'Posts Created',
            // data: [data.Data.postsCreatedLastWeek, data.Data.postsCreatedThisWeek, data.Data.postsCreatedYesterday, data.Data.postsCreatedToday],
            data: [12489, 8530, 1309, 548],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)', // This Month - Red
              'rgba(54, 162, 235, 0.5)', // This Week - Blue
              'rgba(255, 206, 86, 0.5)', // Yesterday - Yellow
              'rgba(75, 192, 192, 0.5)', // Today - Green
            ],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
            borderWidth: 1,
          },
        ],
      };

      const postsOptions = {
        responsive: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };

      const postsBarChart = new Chart(postsCtx, {
        type: 'bar',
        data: postsData,
        options: postsOptions,
      });

      // 캔버스 요소 가져오기
      const visitorsCanvas = document.getElementById('visitorsChart');
      const visitorsCtx = visitorsCanvas.getContext('2d');

      // 데이터
      const visitorsData = {
        labels: ['Last Week', 'This Week', 'Yesterday', 'Today'],
        datasets: [
          {
            label: 'Visitors',
            // data: [data.Data.visitorsLastWeek, data.Data.visitorsThisWeek, data.Data.visitorsYesterday, data.Data.visitorsToday],
            data: [7239, 4882, 1342, 452],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
          },
        ],
      };

      // 옵션
      const visitorsOptions = {
        responsive: false,
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 10000,
            ticks: {
              stepSize: 100,
            },
          },
        },
      };

      // 선 그래프 생성
      const visitorsLineChart = new Chart(visitorsCtx, {
        type: 'line',
        data: visitorsData,
        options: visitorsOptions,
      });
    } else {
      console.error('로그아웃 실패', error);
    }
  } catch (error) {
    console.error('에러:', error);
  }
});
