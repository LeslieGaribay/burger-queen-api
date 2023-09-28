const { mongoConnect, mongoClose } = require('../connect');
const validator = require('validator');
const AppError = require('../errors/app-error');
const { ObjectId } = require('mongodb');

module.exports = {
  async addUser(user) {
    try {
      const database = await mongoConnect();
      const users = database.collection('users');

      // Validar el formato del email
      if (!validator.isEmail(user.email)) {
        throw new AppError(400, 'El email no es valido.');
      }

      // Verifica si el usuario ya existe por su email
      const existingUser = await users.findOne({ email: user.email });
      if (existingUser) {
        throw new AppError(400, 'Usuario ya existe');
      }

      const result = await users.insertOne(user);
      return result;
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      throw error;
    } finally {
      await mongoClose();
    }
  },

  async getUsers() {
    try {
      const database = await mongoConnect();
      const users = database.collection('users');
      return await users.find().toArray();
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      throw error;
    } finally {
      mongoClose();
    }
  },

  async getUser(id) {
    try {
      const database = await mongoConnect();
      const users = database.collection('users');

      //consulta para encontrar el usuario por ID
      const query = {
        '_id': new ObjectId(id)
      };

      const user = await users.findOne(query);
      return user;
    } catch (error) {
      console.error('Error al obtner el usuario:', error);
      throw error;
    } finally {
      await mongoConnect();
    }
  },

  async updateUser(userId, userData) {
    try {
      //Valida userid
      if (!userId) {
        throw new AppError(400, 'Id de usuario requerido');
      }

      // Valida update user data
      if (!userData) {
        throw new AppError(400, 'Se requiere la información del usuario');
      }

      const database = await mongoConnect();
      const users = database.collection('users');

      const query = {
        '_id': new ObjectId(userId)
      };

      // Validar el formato del email si se actualiza
      if (!userData.email || !validator.isEmail(userData.email)) {
        throw new AppError(400, 'El email no es válido.');
      }

      const update = {
        $set: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          active: userData.active,
        }
      };

      const result = await users.updateOne(query, update);
      if(!result.acknowledged || !result.matchedCount) {
        throw new AppError(404, 'Usuario no encontrado');
      }
      existingUser = await users.findOne(query);
      return existingUser;
    } catch (error) {
      console.error('Error al actualizar usuario: ' + error);
      throw error;
    } finally {
      mongoClose();
    }
  },

  async deleteUser(userId) {
    try {
      const database = await mongoConnect();
      const users = database.collection('users');
      // Consulta para eliminar el usuario por ID
      const query = {
        '_id': new ObjectId(userId),
      };
      const result = await users.deleteOne(query);
      return result;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    } finally {
      mongoClose();
    }
  },
};
