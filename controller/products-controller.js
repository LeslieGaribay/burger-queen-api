const { mongoConnect, mongoClose } = require('../connect');
const { ObjectId } = require('mongodb');
module.exports = {
  getProducts: async () => {
    try {
      const database = await mongoConnect();
      const products = database.collection("products");
      return await products.find().toArray();
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      throw error;
    } finally {
      mongoClose();
    }
  },
  
  addProduct: async (product) => {
    try {
      const database = await mongoConnect();
      const products = database.collection("products");
      const result = await products.insertOne(product);
      return result;
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      throw error;
    } finally {
      await mongoClose();
    }
  },

  getProduct: async (id) => {
    try {
      const database = await mongoConnect();
      const products = database.collection("products");

      // Consulta para encontrar el producto por ID
      const query = {
        "_id": new ObjectId(id)
      };
      const product = await products.findOne(query);
      console.log(product);
      return product;
    } catch (error) {
      console.log('Error al buscar el producto: ' + error.message);
      throw error;
    } finally {
      await mongoClose();
    }
  },

  updateProduct: async (product) => {
    try {
      const database = await mongoConnect();
      const products = database.collection("products");
      const result = await products.updateOne(product);
      return result;
    } catch (error) {
      console.error('Error al editar el producto:', error);
      throw error;
    } finally {
      await mongoClose();
    }
  },

  deleteProduct: async (product) => {
    try {
      const database = await mongoConnect();
      const products = database.collection("products");
      const result = await products.deleteOne(product);
      return result;
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      throw error;
    } finally {
      await mongoClose();
    }
  },

};