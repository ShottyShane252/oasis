let username = localStorage.getItem('name');
document.querySelector('.username').textContent = username
  ? username
  : 'vieras';
