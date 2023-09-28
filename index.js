const express = require('express');
const cors = require('cors');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');

const { port, secret } = config;
const app = express();

// Habilita el middleware cors para permitir las solicitudes desde cualquier origen (*)
app.use(cors());

app.set('config', config);
app.set('pkg', pkg);

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json({limit: '1mb'}));

// Configura el middleware de autenticación antes de las rutas
app.use(authMiddleware(secret));

// Registrar rutas
routes(app, (err) => {
  if (err) {
    throw err;
  }

  // Manejo de errores debe configurarse después de registrar las rutas
  app.use(errorHandler);

  app.listen(port, () => {
    console.info(`App listening on port ${port}`);
  });
});
