const jwt = require('jsonwebtoken');
const config = require('../config');
module.exports = (secret) => (req, resp, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return next();
    }

    const [type, token] = authorization.split(' ');

    if (type.toLowerCase() !== 'bearer') {
        return next();
    }

    jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
            return next(403);
        }
        return next();
        // TODO: Verificar identidad del usuario usando `decodeToken.uid`

    });
};

module.exports.isAuthenticated = (req) => {
    // TODO: decidir por la informacion del request si la usuaria esta autenticada
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
    // TODO: decidir por la informacion del request si la usuaria es admin
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
        ? next(401)
        : next()
);

module.exports.requireAdmin = (req, resp, next) => (
    // eslint-disable-next-line no-nested-ternary
    (!module.exports.isAuthenticated(req))
        ? next(401)
        : (!module.exports.isAdmin(req))
            ? next(403)
            : next()
);
