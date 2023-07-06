class Message {
  constructor(uid, name, message) {
    this.uid = uid;
    this.name = name;
    this.message = message;
  }
}

class Chat {
  constructor() {
    this.users = {}; // { uid: { name, uid, photo } }
    this.messages = [];
  }

  get last10Messages() {
    return this.messages.splice(0, 10);
  }

  get usersToArray() {
    return Object.values(this.users);
  }

  sendMessage(uid, name, message) {
    const msg = new Message(uid, name, message);
    this.messages.unshift(msg);
  }

  connectUser(user) {
    this.users[user.id] = user;
  }

  disconnectUser(id) {
    delete this.users[id];
  }
}

module.exports = Chat;
