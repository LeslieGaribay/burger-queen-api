const jwt = require('jsonwebtoken');
const config = require('../config');
const AppError = require('../errors/app-error');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(); // Continuar al siguiente middleware sin enviar una respuesta
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next(); // Continuar al siguiente middleware sin enviar una respuesta
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return next(new AppError(403, 'No autorizado')); // Usar un objeto Error con mensaje
    }
    return next(); // Continuar al siguiente middleware sin enviar una respuesta
  });
};

module.exports.isAuthenticated = (req) => {

  // Verifica si el token está presente y es válido
  const authorization = req.headers.authorization;
  if (!authorization) {
    return false; // El token no está presente
  }
  const [type, token] = authorization.split(' ');
  try {
    const decodedToken = jwt.verify(token, config.secret);
    return true; // El token es válido
  } catch (error) {
    return false; // El token no es válido
  }
};

module.exports.isAdmin = (req) => {
  // Verifica si el usuario tiene el rol de "admin" en el token
  const authorization = req.headers.authorization;
  if (!authorization) {
    return false; // El token no está presente
  }
  const [type, token] = authorization.split(' ');

  try {
    const decodedToken = jwt.verify(token, config.secret);
    const userRole = decodedToken.rol;

    // Verifica si el rol del usuario es "admin"
    return userRole === 'admin';
  } catch (error) {
    return false; // El token no es válido
  }
};

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(new AppError(401, 'No autenticado'))
    : next()
);

module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(new AppError(401, 'No autenticado'))
    : (!module.exports.isAdmin(req))
      ? next(new AppError(403, 'No autorizado'))
      : next()
);

module.exports.isWaiter = (req) => {
  // Verifica si el usuario tiene el rol de "waiter" en el token
  const authorization = req.headers.authorization;
  if (!authorization) {
    return false; // El token no está presente
  }
  const [type, token] = authorization.split(' ');

  try {
    const decodedToken = jwt.verify(token, config.secret);
    const userRole = decodedToken.rol;

    // Verifica si el rol del usuario es "waiter"
    return userRole === 'waiter';
  } catch (error) {
    return false; // El token no es válido
  }
};

module.exports.requireWaiter = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(new AppError(401, 'No autenticado'))
    : (!module.exports.isWaiter(req))
      ? next(new AppError(403, 'No autorizado'))
      : next()
);


// Middleware para verificar si el usuario es un chef
module.exports.isChef = (req) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return false; // El token no está presente
  }
  const [type, token] = authorization.split(' ');

  try {
    const decodedToken = jwt.verify(token, config.secret);
    const userRole = decodedToken.rol;

    // Verifica si el rol del usuario es "chef"
    return userRole === 'chef';
  } catch (error) {
    return false; // El token no es válido
  }
};

// Middleware para requerir que el usuario sea un chef
module.exports.requireChef = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(new AppError(401, 'No autenticado'))
    : (!module.exports.isChef(req))
      ? next(new AppError(403, 'No autorizado. Solo los chef pueden acceder.'))
      : next()
);

