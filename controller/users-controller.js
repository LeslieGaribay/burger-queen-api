const { mongoConnect, mongoClose } = require('../connect');
module.exports = {
    getUsers: async (req, resp, next) => {
        // TODO: Implementa la función necesaria para traer la colección `users`
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

