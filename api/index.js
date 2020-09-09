const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({
  path: path.join(__dirname, '../.env'),
});
const contactRouters = require('./routes/contactRouter');
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  {
    flags: 'a',
  },
);
class CRUDServer {
  constructor() {
    this.server = null;
  }
  start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.startListening();
  }
  initServer() {
    this.server = express();
  }
  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(
      cors({
        origin: 'http//localhost:3000',
      }),
    );
    this.server.use(morgan('combined', { stream: accessLogStream }));
  }
  initRoutes() {
    this.server.use('/api/contacts', contactRouters);
  }
  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log('start server');
    });
  }
}
const startCrudServer = new CRUDServer();
startCrudServer.start();
