const buttonSignOut = document.querySelector('#google_signout');
const myForm = document.querySelector('form');

const url = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080/api/auth'
  : 'https://restserver-node-course-api.herokuapp.com/api/auth';

function handleCredentialResponse(response) {
  const google_token = response.credential;
  fetchAuth('google', { google_token });
}

myForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const fields = Object.fromEntries(new FormData(event.currentTarget));
  fetchAuth('login', fields);
});

function fetchAuth(uri, data) {
  fetch(`${url}/${uri}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((resp) => {
      if (resp.ok) return resp.json();
      throw new Error('Failed to login');
    })
    .then(({ access_token }) => {
      localStorage.setItem('token', access_token);
      window.location = 'chat.html';
    })
    .catch(console.error);
}

buttonSignOut.addEventListener('click', () => {
  console.log(google.accounts.id);

  google.accounts.id.disableAutoSelect();
  google.accounts.id.revoke(localStorage.getItem('email'), (done) => {
    localStorage.removeItem('email');
    location.reload();
  });
});
