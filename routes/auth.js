const jwt = require('jsonwebtoken');
const { mongoConnect, mongoClose } = require('../connect');
const config = require('../config');
const { response } = require('express');
const { secret } = config;


/** @module auth */
module.exports = (app, nextMain) => {
  /**
   * @name /auth
   * @description Crea token de autenticación.
   * @path {POST} /auth
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @response {Object} resp
   * @response {String} resp.token Token a usar para los requests sucesivos
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @auth No requiere autenticación
   */
  app.post('/auth', async (request, response, next) => {
    const { email, password } = request.body;

    if (!email || !password) {
      return next(400);
    }

    try {
      // Buscar al usuario en la base de datos por correo electrónico
      const user = await getUser(email);

      // Si no se encuentra el usuario, retornar 401 (No autorizado)
      if (!user) {
        return response
          .status(401).send('Invalid user or password');
      }
      //Autentica al usuario comparando el correo y la constraseña
      if (user.email === email && user.password === password) {
        // Crear un token JWT y responder con él
        const token = jwt.sign({ uid: user._id, rol: user.role }, secret);
        response
          .status(200)
          .send({ token });
      } else {
        // Si la contraseña no coincide, retornar 401 (No autorizado)
        response
          .status(401)
          .send('Invalid user or password');
      }
    } catch (error) {
      console.error('Error al autenticar al usuario:', error);
      response
        .status(500)
        .send({
          error: 'Error al autenticar al usuario',
          message: error.message
        });
    }
  });
  async function getUser(email) {
    try {
      const database = await mongoConnect();
      const users = database.collection('users');
      // const products = database.collection("products");

      // Consulta para encontrar al usuario por correo electrónico
      const query = { email };
      const user = await users.findOne(query);
      console.log(user);
      return user;
    } catch (error) {
      console.log('Error al buscar usuario: ' + error.message);
      throw error;
    } finally {
      mongoClose();
    }
  }
  app.get('/validateToken', (request, response, next) => {
    const authorization = request.get('authorization');
    try {
      if (jwt.verify(authorization, secret)) {
        response
          .status(200)
          .send({
            message: 'Your token is valid! 🥳🐵',
          });
      } else {
        response
          .status(401)
          .send({
            message: 'Your token is invalid 🙈',
          });
      }
    } catch (exception) {
      if (exception.name === 'JsonWebTokenError') {
        response
          .status(401)
          .send({
            message: 'Your token is invalid 😒',
          });
      } else {
        throw exception;
      }
      console.log(exception);
    }
    next();
  });
  return nextMain();
};