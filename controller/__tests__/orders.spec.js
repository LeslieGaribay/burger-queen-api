const ordersController = require('../orders-controller');
const { ObjectId } = require('mongodb');
const { mongoConnect, mongoClose } = require('../../connect')

describe('createOrder', () => {
  it('deberia crear la orden si el usuario es mesero', async () => {

    const waiterUser = { role: 'waiter' };
    const createOrderSpy = jest.spyOn(ordersController, 'createOrder').mockResolvedValue(waiterUser);

    const result = await ordersController.createOrder(order = {
      orderId: '123456',
      items: [
        { name: 'Pizza', quantity: 2, price: 10.99 },
        { name: 'Burger', quantity: 1, price: 5.99 },
      ],
      total: 27.97,
      customerName: 'Pepito Pérez',
    }
      , waiterUser);
    expect(createOrderSpy).toHaveBeenCalledWith(order, waiterUser);
    expect(result).toEqual(waiterUser);
    createOrderSpy.mockRestore();
  });
});

describe('getOrders', () => {
  it('debería obtener las órdenes correctamente', async () => {
    const waiterUser = { role: 'waiter' };
    const createOrderSpy = jest.spyOn(ordersController, 'createOrder').mockResolvedValue(waiterUser);

    const createdOrderData = {
      orderId: '123456',
      items: [
        { name: 'Pizza', quantity: 2, price: 10.99 },
        { name: 'Burger', quantity: 1, price: 5.99 },
      ],
      total: 27.97,
      customerName: 'Pepito Pérez',
      customerTable: '5',
    };

    const createdOrder = await ordersController.createOrder(createdOrderData, waiterUser);

    const orders = await ordersController.getOrders();
    expect(Array.isArray(orders)).toBe(true);

    // Verifica que cada orden en la lista de órdenes coincida con la orden creada
    orders.forEach((order) => {
      expect(order).toHaveProperty('orderId', createdOrder.orderId);
      expect(order).toHaveProperty('items', createdOrder.items);
      expect(order).toHaveProperty('total', createdOrder.total);
      expect(order).toHaveProperty('customerName', createdOrder.customerName);
      expect(order).toHaveProperty('customerTable', createdOrder.customerTable);
    });

    createOrderSpy.mockRestore();
  });
});

describe('getOrderById', () => {
  it('debería obtener una orden por su ID', async () => {
    const collectionMock = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null),
    });
    const mongoConnect = jest.fn().mockReturnValue({
      collection: collectionMock,
    });

    // Espiar la función mongoClose()
    // const spyMongoClose = jest.spyOn(mongoClose, 'call');

    // Mockear la función mongoClose()
    // jest.mock('mongodb', () => ({
    //   mongoClose: jest.fn().mockResolvedValue(),
    // }));

    mongoConnect();

    const orderId = '313233343536373839303132';
    const order = await collectionMock().findOne({ _id: new ObjectId('313233343536373839303132') });

    expect(mongoConnect).toHaveBeenCalledTimes(1);
    expect(collectionMock().findOne).toHaveBeenCalledWith({ _id: new ObjectId('313233343536373839303132') });
    expect(order).toBeNull();

    // expect(spyMongoClose).toHaveBeenCalledTimes(1);
  });
});
