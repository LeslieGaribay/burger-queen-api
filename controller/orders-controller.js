const { ObjectId } = require('mongodb');
const { mongoConnect, mongoClose } = require('../connect');
const AppError = require('../errors/app-error');
const OrderStatus = {
  ENVIADA: 0,
  PENDIENTE: 1,
  COMPLETADA: 2,
};

module.exports = {
  
  async createOrder(order, user) {
    try {
      // Verificar el rol del usuario
      if (user.role !== 'waiter') {
        throw new AppError(403, 'Acceso denegado. Sólo los Meseros pueden crear órdenes.');
      }
      // Validar que ninguna propiedad sea null o undefined
      for (const key in order) {
        if (order[key] === null || order[key] === undefined) {
          throw new AppError(400, `La propiedad '${key}' no puede ser nula ni indefinida.`);
        }
      }
  
      // Validar la estructura de la orden
      if (
        typeof order.userId !== 'number' ||
        typeof order.client !== 'string' ||
        !Array.isArray(order.products) ||
        !order.products.every(product =>
          typeof product.qty === 'number' &&
          typeof product.product.id === 'number' &&
          typeof product.product.name === 'string' &&
          typeof product.product.price === 'number' &&
          typeof product.product.image === 'string' &&
          typeof product.product.type === 'string' &&
          typeof product.product.dateEntry === 'string'
        ) ||
        !Object.values(OrderStatus).includes(order.status)
      ) {
        throw new AppError(400, 'Datos de orden no válidos.');
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
