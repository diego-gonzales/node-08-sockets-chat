const btnLogout = document.querySelector('#btnLogout');
const uidInput = document.querySelector('#uid');
const messageInput = document.querySelector('#message');
const chatsList = document.querySelector('#chatsList');
const privateChatsList = document.querySelector('#privateChatsList');
const usersList = document.querySelector('#usersList');

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

  socket.on('active-users', renderUsers);

  socket.on('receive-messages', renderMessages);

  socket.on('private-message', renderPrivateMessages);

  messageInput.addEventListener('keyup', ({ keyCode }) => {
    const message = messageInput.value.trim();
    const uidToPrivateMessage = uidInput.value.trim();

    if (keyCode !== 13) return;
    if (message.length === 0) return;

    socket.emit('send-message', { uidToPrivateMessage, message });

    messageInput.value = '';
  });
}

function renderUsers(users = []) {
  let usersHtml = '';
  users.forEach(({ name, uid }) => {
    usersHtml += `
      <li>
        <p>
          <h5 class="text-success">${name}</h5>
          <span class="fs-6 text-muted">${uid}</span>
        </p>
      </li>
    `;
  });

  usersList.innerHTML = usersHtml;
}

function renderMessages(messages = []) {
  let messagesHtml = '';
  messages.forEach(({ name, message }) => {
    messagesHtml += `
      <li>
        <figure>
          <blockquote class="blockquote">
            <p>${message}</p>
          </blockquote>
          <figcaption class="blockquote-footer text-primary">
            ${name}
          </figcaption>
        </figure>
      </li>
    `;
  });

  chatsList.innerHTML = messagesHtml;
}

function renderPrivateMessages({ from, message }) {
  let privateMessagesHtml = '';
  privateMessagesHtml += `
    <li>
      <figure>
        <blockquote class="blockquote">
          <p>${message}</p>
        </blockquote>
        <figcaption class="blockquote-footer text-primary">
          ${from}
        </figcaption>
      </figure>
    </li>
  `;

  privateChatsList.innerHTML += privateMessagesHtml;
}

main();
