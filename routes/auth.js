const jwt = require('jsonwebtoken');
const {  mongoConnect, mongoClose } = require('../connect');
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
  app.post('/auth', async (request, response, next) => {
    const { email, password } = request.body;

    if (!email || !password) {
      return next(400);
    }
    console.log("jejejeje");
    // TODO: autenticar a la usuarix
    // Hay que confirmar si el email y password
    // coinciden con un user en la base de datos
    // Si coinciden, manda un access token creado con jwt
    const user = await getUser(email);
    if (user?.email === email && user?.password === password) {
      var token = jwt.sign({ foo: 'bar' }, secret);
      response
        .status(200)
        .send({
          token
        });
    } else {
      response
        .status(401)
        .send("Invalid user or password");
    }
  });
  async function getUser(email) {
    try {
      const database = await mongoConnect();
      const users = database.collection("users");
      const products = database.collection("products");
      
      // Query for a movie that has the title 'The Room'
      const query = { email };

      const user = await users.findOne(query);
      // since this method returns the matched document, not a cursor, print it directly
      console.log(user);
      return user;
    } catch(e) {
      console.log(e)
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
            message: "Your token is valid! 🥳🐵"
          });
      } else {
        response
          .status(401)
          .send({
            message: "Your token is invalid 🙈"
          });
      }
    } catch(exception) {
      if (exception.name === 'JsonWebTokenError') {
        response
        .status(401)
        .send({
          message: "Your token is invalid 😠😒"
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


//aprender a hacer llamada a la base de datos mongodb y docker