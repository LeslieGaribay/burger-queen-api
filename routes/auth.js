const jwt = require('jsonwebtoken');
const config = require('../config');
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
  app.post('/auth', (request, response, next) => {
    const { email, password } = request.body;

    if (!email || !password) {
      return next(400);
    }
    console.log("jejejeje");
    // TODO: autenticar a la usuarix
    // Hay que confirmar si el email y password
    // coinciden con un user en la base de datos
    // Si coinciden, manda un access token creado con jwt
    if (email === "holamundo@hola.com" && password === "Password123") {
      var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
      response
        .status(200)
        .send({
          token
        });
    }

    next();
  });

  return nextMain();
};


//aprender a hacer llamada a la base de datos mongodb y docker