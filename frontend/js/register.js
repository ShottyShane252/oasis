import { fetchData } from './fetch.js';

console.log('Register page loaded');

const registerUser = async (event) => {
  event.preventDefault();

  const registerForm = document.querySelector('.registerForm');

  const username = registerForm.querySelector('#username').value.trim();
  const password = registerForm.querySelector('#password').value.trim();
  const email = registerForm.querySelector('#email').value.trim();

  const bodyData = {
    username: username,
    password: password,
    email: email,
  };

  const url = 'http://localhost:3000/api/users';

  const options = {
    body: JSON.stringify(bodyData),
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  };

  const response = await fetchData(url, options);

  if (response.error) {
    console.error('Error adding a new user:', response.error);
    logResponse('registerResponse', `Virhe: ${response.error}`);
    return;
  }

  if (response.message) {
    console.log(response.message, 'success');
    logResponse('registerResponse', 'Rekisteröityminen onnistui! Siirrytään kirjautumiseen...');

    registerForm.reset();

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  }
};

function logResponse(codeblock, text) {
  document.getElementById(codeblock).innerText = text;
}

const registerForm = document.querySelector('.registerForm');
registerForm.addEventListener('submit', registerUser);
