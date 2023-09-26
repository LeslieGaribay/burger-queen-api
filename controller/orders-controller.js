const { mongoConnect, mongoClose } = require('../connect');
const { ObjectId } = require('mongodb');
const AppError = require('../errors/app-error');

module.exports = {
  async createOrder(order, user) {
    try {
      // Verificar el rol del usuario
      if (user.role !== 'waiter') {
        throw new AppError(403, 'Acceso denegado. Sólo los Meseros pueden crear órdenes.');
      }

      const database = await mongoConnect();
      const orders = database.collection('orders');

      const result = await orders.insertOne(order);
      return result.ops[0];
    } catch (error) {
      console.error('Error al crear la orden:', error);
      throw error;
    } finally {
      await mongoClose();
    }
  },

  async getOrders() {
    try {
      const database = await mongoConnect();
      const orders = database.collection('orders');

      const orderList = await orders.find().toArray();
      return orderList;
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);
      throw error;
    } finally {
      await mongoClose();
    }
  },

  async getOrderById(orderId) {
    try {
      const database = await mongoConnect();
      const orders = database.collection('orders');

      const query = { _id: new ObjectId(orderId) };
      const order = await orders.findOne(query);
      return order;
    } catch (error) {
      console.error('Error al obtener la orden por ID:', error);
      throw error;
    } finally {
      await mongoClose();
    }
  },

  async updateOrder(orderId, updatedOrderData) {
    try {
      const database = await mongoConnect();
      const orders = database.collection('orders');

      const query = { _id: new ObjectId(orderId) };
      const update = { $set: updatedOrderData };

      const result = await orders.updateOne(query, update);
      if (!result.matchedCount) {
        throw new AppError(404, 'Orden no encontrada');
      }

      return result;
    } catch (error) {
      console.error('Error al actualizar la orden:', error);
      throw error;
    } finally {
      await mongoClose();
    }
  },

  async deleteOrder(orderId) {
    try {
      const database = await mongoConnect();
      const orders = database.collection('orders');

      const query = { _id: new ObjectId(orderId) };
      const result = await orders.deleteOne(query);

      return result;
    } catch (error) {
      console.error('Error al eliminar la orden:', error);
      throw error;
    } finally {
      await mongoClose();
    }
  },
};
