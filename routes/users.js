// const bcrypt = require('bcrypt');
const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

const {
  getUsers,
  addUser,
  getUser,
  deleteUser,
  updateUser,
} = require('../controller/users-controller');

const initAdminUser = (app, next) => {
  const { adminEmail, adminPassword } = app.get('config');
  if (!adminEmail || !adminPassword) {
    return next();
  }
  // const adminUser = {
  //   email: adminEmail,
  //   password: bcrypt.hashSync(adminPassword, 10),
  //   roles: { admin: true },
  // };
  next();
};
/*
 * Diagrama de flujo de una aplicación y petición en node - express :
 *
 * request  -> middleware1 -> middleware2 -> route
 *                                             |
 * response <- middleware4 <- middleware3   <---
 *
 * la gracia es que la petición va pasando por cada una de las funciones
 * intermedias o "middlewares" hasta llegar a la función de la ruta, luego esa
 * función genera la respuesta y esta pasa nuevamente por otras funciones
 * intermedias hasta responder finalmente a la usuaria.
 *
 * Un ejemplo de middleware podría ser una función que verifique que una usuaria
 * está realmente registrado en la aplicación y que tiene permisos para usar la
 * ruta. O también un middleware de traducción, que cambie la respuesta
 * dependiendo del idioma de la usuaria.
 *
 * Es por lo anterior que siempre veremos los argumentos request, response y
 * next en nuestros middlewares y rutas. Cada una de estas funciones tendrá
 * la oportunidad de acceder a la consulta (request) y hacerse cargo de enviar
 * una respuesta (rompiendo la cadena), o delegar la consulta a la siguiente
 * función en la cadena (invocando next). De esta forma, la petición (request)
 * va pasando a través de las funciones, así como también la respuesta
 * (response).
 */

/** @module users */
module.exports = (app, next) => {
  /**
   * @name GET /users
   * @description Lista usuarias
   * @path {GET} /users
   * @query {String} [page=1] Página del listado a consultar
   * @query {String} [limit=10] Cantitad de elementos por página
   * @header {Object} link Parámetros de paginación
   * @header {String} link.first Link a la primera página
   * @header {String} link.prev Link a la página anterior
   * @header {String} link.next Link a la página siguiente
   * @header {String} link.last Link a la última página
   * @auth Requiere `token` de autenticación y que la usuaria sea **admin**
   * @response {Array} users
   * @response {String} users[]._id
   * @response {Object} users[].email
   * @response {Object} users[].roles
   * @response {Boolean} users[].roles.admin
   * @code {200} si la autenticación es correcta
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si no es ni admin
   */
  app.get('/users', requireAdmin, async (req, res) => {
    try {
      const users = await getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la lista de usuarios' })
    };
  });
  /**
   * @name GET /users/:uid
   * @description Obtiene información de una usuaria
   * @path {GET} /users/:uid
   * @params {String} :uid `id` o `email` de la usuaria a consultar
   * @auth Requiere `token` de autenticación y que la usuaria sea **admin** o la usuaria a consultar
   * @response {Object} user
   * @response {String} user._id
   * @response {Object} user.email
   * @response {Object} user.roles
   * @response {Boolean} user.roles.admin
   * @code {200} si la autenticación es correcta
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si no es ni admin o la misma usuaria
   * @code {404} si la usuaria solicitada no existe
   */
  app.get('/users/:id', requireAuth, async (req, res) => {
    const { id } = req.params;

    try {
      const user = await getUser(id);

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      if (req.user.email !== user.email && !req.user.roles.admin) {
        return res.status(403).json({ error: 'No autorizado' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener informacion del usuario' });
    }
  });

  /**
   * @name POST /users
   * @description Crea una usuaria
   * @path {POST} /users
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @body {Object} [roles]
   * @body {Boolean} [roles.admin]
   * @auth Requiere `token` de autenticación y que la usuaria sea **admin**
   * @response {Object} user
   * @response {String} user._id
   * @response {Object} user.email
   * @response {Object} user.roles
   * @response {Boolean} user.roles.admin
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si ya existe usuaria con ese `email`
   */
  app.post('/users', requireAdmin, async (require, response, next) => {
    // Obtener los datos del nuevo usuario desde el cuerpo de la solicitud
    const { name, email, password, role } = require.body;
    try {
      // Validar datos
      if (!name || !email || !password || !role) {
        return response
          .status(400)
          .json({ message: 'Todos los campos son requeridos' });
      }
      // Crear un objeto de nuevo usuario
      const newUser = {
        name,
        email,
        password,
        role,
      };
      //Llamamos a la funcion addUser para agregar el nuevo usuario a la db
      const result = await addUser(newUser);
      // si los datos son validos insertar usuario
      if (result.insertedId) {
        return response
          .status(201)
          .json({ message: 'Usuario agregado con éxito' });
        // si no rechaza peticion indicar el error
      } else {
        return response
          .status(400)
          .json({ message: 'Ha fallado la inserción' });
      }
    } catch (error) {
      console.error('Error al agregar al usuario: ' + error);
      return response
        .status(500)
        .json({ message: 'Error agregando usuario', error: error.message });
    }
  });

  /**
   * @name PUT /users
   * @description Modifica una usuaria
   * @params {String} :uid `id` o `email` de la usuaria a modificar
   * @path {PUT} /users
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @body {Object} [roles]
   * @body {Boolean} [roles.admin]
   * @auth Requiere `token` de autenticación y que la usuaria sea **admin** o la usuaria a modificar
   * @response {Object} user
   * @response {String} user._id
   * @response {Object} user.email
   * @response {Object} user.roles
   * @response {Boolean} user.roles.admin
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si no es ni admin o la misma usuaria
   * @code {403} una usuaria no admin intenta de modificar sus `roles`
   * @code {404} si la usuaria solicitada no existe
   */
  app.put('/users/:id', requireAuth, async (req, resp, next) => {
    try {
      console.log(req.body);
      const user = await updateUser(
        req.params.id,
        req.body,
      );

      if (!user) {
        return resp.status(404).json({ error: 'Usuario no encontrado' });
      }
      resp
        .status(201)
        .json(user);
    } catch (error) {
      resp.status(500).json({ error: 'No se pudo actualizar el usuario' });
    }
  });
  /**
   * @name DELETE /users
   * @description Elimina una usuaria
   * @params {String} :uid `id` o `email` de la usuaria a modificar
   * @path {DELETE} /users
   * @auth Requiere `token` de autenticación y que la usuaria sea **admin** o la usuaria a eliminar
   * @response {Object} user
   * @response {String} user._id
   * @response {Object} user.email
   * @response {Object} user.roles
   * @response {Boolean} user.roles.admin
   * @code {200} si la autenticación es correcta
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si no es ni admin o la misma usuaria
   * @code {404} si la usuaria solicitada no existe
   */
  app.delete('/users/:id', requireAuth, async (req, resp, next) => {
    try {
      console.log(req.body);
      const user = await deleteUser(req.params.id);
      if (!user) {
        return resp.status(404).json({ error: 'Usuario no encontrado' });
      }
      resp.status(200).json({ mensaje: 'Usuario eliminado con éxito' });
    } catch (error) {
      resp.status(500).json({ error: 'No se pudo eliminar el usuario' });
    }
  });
  initAdminUser(app, next);
};