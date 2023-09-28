const { mongoConnect, mongoClose } = require('../connect');
const { ObjectId } = require('mongodb');
const { saveImageLocally } = require('../business-logic/products-business-logic');

module.exports = {
  getProducts: async (type) => {
    try {
      const database = await mongoConnect();
      const products = database.collection("products");
     
      const filter = type ? { type } : {};
      return await products.find(filter).toArray();
    } catch (error) {
      console.error('Error al obtener los productos:', error);
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
      return product;
    } catch (error) {
      console.log('Error al buscar el producto: ' + error.message);
      throw error;
    } finally {
      await mongoClose();
    }
  },

  updateProduct: async (productId, product) => {
    try {
      const imageName = await saveImageLocally(product.image);
      product.image = imageName;

      const database = await mongoConnect();
      const products = database.collection("products");
      const query = {
        "_id": new ObjectId(productId)
      };
      const result = await products.updateOne(query, {"$set": product});
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