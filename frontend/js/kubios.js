// import '../css/style.css';
// import '../css/mobile.css';
// import '../css/kubios.css';

import { getUserInfo, getUserData } from './kubios-data.js';

const getUserInfoBtn = document.querySelector('.get_user_info');
getUserInfoBtn.addEventListener('click', getUserInfo);

const getUserDataBtn = document.querySelector('.get_user_data');
getUserDataBtn.addEventListener('click', getUserData);

// piirretään graafit, suora esimerkki sivuilta
// https://www.chartjs.org/docs/latest/getting-started/

const ctx = document.getElementById('myChart');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Punanen', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 15, 3, 5, 2, 3],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
