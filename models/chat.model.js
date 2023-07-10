class Message {
  constructor(uid, name, message) {
    this.uid = uid;
    this.name = name;
    this.message = message;
  }
}

class MensajePrivado {
  constructor(uid, nombre, mensaje, uidDestinatario, destinatario) {
    this.uid = uid;
    this.nombre = nombre;
    this.mensaje = mensaje;
    this.uidDestinatario = uidDestinatario;
    this.destinatario = destinatario;
  }
}

class Chat {
  constructor() {
    this.users = {}; // { uid: { name, uid, photo } }
    this.messages = [];
    this.mensajesPrivados = [];
  }

  get last10Messages() {
    this.messages = this.messages.splice(0, 10);
    return this.messages;
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

  misMensajesPrivados(uid = '') {
    let mensajesPrivadísimos = [...this.mensajesPrivados].filter(
      (msgPrivado) => msgPrivado.destinatario !== uid
    );
    // console.log(mensajesPrivadísimos);

    return mensajesPrivadísimos;
  }

  enviarMensajePrivado(uid, nombre, mensaje, uidDestinatario, destinatario) {
    const msg = new MensajePrivado(
      uid,
      nombre,
      mensaje,
      uidDestinatario,
      destinatario
    );

    this.mensajesPrivados.unshift(msg);
  }
}

module.exports = Chat;
