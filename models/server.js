const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');
const { Server: Servidor } = require('socket.io');
const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = createServer(this.app);
    this.io = new Servidor(this.server);
    this.paths = {
      auth: '/api/auth',
      users: '/api/users',
      categories: '/api/categories',
      products: '/api/products',
      search: '/api/search',
      uploads: '/api/uploads',
    };

    // Connect to database
    this.connectToDatabase();

    // Middlewares
    this.middlewares();

    // Routes
    this.routes();

    // Sockets
    this.sockets();
  }

  async connectToDatabase() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Defined 'public' directory
    this.app.use(express.static('public'));

    // File upload - Carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true, // <--- Allows to create the folder if it doesn't exist
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require('../routes/auth.routes'));
    this.app.use(this.paths.users, require('../routes/users.routes'));
    this.app.use(this.paths.categories, require('../routes/categories.routes'));
    this.app.use(this.paths.products, require('../routes/products.routes'));
    this.app.use(this.paths.search, require('../routes/search.routes'));
    this.app.use(this.paths.uploads, require('../routes/uploads.routes'));
  }

  sockets() {
    this.io.on('connection', (socket) => socketController(socket, this.io));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log('App listening on port', process.env.PORT);
    });
  }
}

module.exports = Server;
