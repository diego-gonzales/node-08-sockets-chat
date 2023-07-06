const btnLogout = document.querySelector('#btnLogout');
const uidInput = document.querySelector('#uid');
const messageInput = document.querySelector('#message');

const API_URL = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080/api/auth/renew-token'
  : 'https://restserver-node-course-api.herokuapp.com/api/auth/renew-token';
const TOKEN = localStorage.getItem('token') || '';

const main = async () => {
  try {
    const resp = await fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json',
        authorization: TOKEN,
      },
    });

    const { ok, user, access_token } = await resp.json();

    if (!ok) throw new Error();

    localStorage.setItem('token', access_token);
    document.title = user.name;

    await connectToSocket(access_token);
  } catch (err) {
    console.log(err);
    localStorage.removeItem('token');
    window.location = 'index.html';
  }
};

async function connectToSocket(token) {
  const socket = io({
    extraHeaders: { token },
  });

  socket.on('connect', () => {
    console.log('Sockets online');
  });

  socket.on('disconnect', () => {
    console.log('Sockets offline');
  });

  socket.on('active-users', (payload) => {
    console.log(payload);
  });
}

main();
