const { mongoConnect, mongoClose } = require('../connect');
const validator = require('validator');
const AppError = require('../errors/app-error');
const { ObjectId } = require('mongodb');

module.exports = {
  addUser: async (user) => {
    try {
      const database = await mongoConnect();
      const users = database.collection("users");

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
  getUsers: async () => {
    try {
      const database = await mongoConnect();
      const users = database.collection("users");
      return await users.find().toArray();
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      throw error;
    } finally {
      mongoClose();
    }
  },
  getUser: async (id) => {
    try {
      const database = await mongoConnect();
      const users = database.collection('users');

      //consulta para encontrar el usuario por ID
      const query = {
        "_id": new ObjectId(id)
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
  updateUser: async (id, updatedUserData) => {
    try {
      const database = await mongoConnect();
      const users = database.collection("users");

      // Validar el formato del email si se actualiza
      if (updatedUserData.email && !validator.isEmail(updatedUserData.email)) {
        throw new AppError(400, 'El email no es válido.');
      }

      // Consulta para actualizar el usuario por ID
      const query = {
        "_id": new ObjectId(id)
      };

      const update = {
        $set: {
          name: updatedUserData.name,
          email: updatedUserData.email,
          password: updatedUserData.password,
          role: updatedUserData.role
        }
      };

      const result = await users.updateOne(query, update);
      return result;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    } finally {
      mongoClose();
    }
  },
  deleteUser: async (id) => {
    try {
      const database = await mongoConnect();
      const users = database.collection("users");
      // Consulta para eliminar el usuario por ID
      const query = {
        "_id": new ObjectId(id)
      };
      const result = await users.deleteOne(query);
      return result;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    } finally {
      mongoClose();
    }
  }
}