/*
  loggedUser.js tiedoston kehityksessä on hyödynnetty
  tekoälyä (ChatGPT) kirjautumistilan hallinnan
  ja käyttöliittymäpäivitysten tukena.
*/
const username = localStorage.getItem('name');
const token = localStorage.getItem('token');

const usernameElement = document.querySelector('.username');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

if (usernameElement) {
  usernameElement.textContent =
    token && username && username !== 'undefined' ? username : 'Vieras';
}

if (loginBtn) {
  loginBtn.style.display = token ? 'none' : 'inline-block';
}

if (logoutBtn) {
  logoutBtn.style.display = token ? 'inline-block' : 'none';
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    window.location.href = 'login.html';
  });
}
