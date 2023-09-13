const { mongoConnect, mongoClose } = require('../connect');
const validator = require('validator');
const AppError = require('../errors/app-error');

module.exports = {
    getUsers: async (req, resp, next) => {
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
    }
};

