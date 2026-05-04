import { fetchData } from './fetch.js';

console.log('Moi luodaan nyt tokeneita ja kirjaudutaan sisään');

const loginUser = async (event) => {
  event.preventDefault();

  const loginForm = document.querySelector('.loginForm');
  const loginError = document.querySelector('#loginError');

  loginError.style.display = 'none';
  loginError.textContent = '';

  const username = loginForm.querySelector('input[name=username]').value;
  const password = loginForm.querySelector('input[name=password]').value;

  const bodyData = {
    username: username,
    password: password,
  };

  const url = 'http://localhost:3000/api/users/login';

  const options = {
    body: JSON.stringify(bodyData),
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  };
  //Kirjaa käyttäjätunnuksen ja salasanan konsoliin näkyviin
  //console.log(options);
  //Kirjaa käyttäjätunnus näkyviin salasana piiloon
  console.log("Username:", username,"Password:", "*".repeat(password.length));

  const response = await fetchData(url, options);

  if (response.error) {
    console.error('Error login in:', response.error);

    loginError.textContent = 'Käyttäjänimi tai salasana on väärin.';
    loginError.style.display = 'block';

    return;
  }

  if (response.message) {
    console.log(response.message, 'success');
    localStorage.setItem('token', response.token);
    localStorage.setItem('name', response.user.username || response.user.given_name || 'vieras');
    /* logResponse(
      'loginResponse',
      // `localStorage set with token value: ${response.token}`
    ); */
    setTimeout(function () {
      window.location.href = 'diary.html';
    }, 3000);
  }

  console.log(response);
  loginForm.reset();
};

/* function logResponse(codeblock, text) {
  document.getElementById(codeblock).innerText = text;
} */

const loginForm = document.querySelector('.loginForm');
loginForm.addEventListener('submit', loginUser);
