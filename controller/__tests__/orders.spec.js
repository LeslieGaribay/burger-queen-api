jest.mock('../../connect.js', () => ({
  mongoConnect: jest.fn(),
  mongoClose: jest.fn(),
}));
const ordersController = require('../orders-controller');
const { ObjectId } = require('mongodb');
const { mongoConnect, mongoClose } = require('../../connect')
const AppError = require('../../errors/app-error');

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
  let collectionMock;
  const ordersData = [{
    orderId: '123456',
    items: [
      { name: 'Pizza', quantity: 2, price: 10.99 },
      { name: 'Burger', quantity: 1, price: 5.99 },
    ],
    total: 27.97,
    customerName: 'Pepito Pérez',
    customerTable: '5',
  }];

  beforeEach(() => {
    collectionMock = jest.fn('orders').mockReturnValue({
      find:  jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue(ordersData)
      }),
    });
    mongoConnect.mockResolvedValue({
      collection: collectionMock,
    });
  });

  afterEach(() => {
    mongoConnect.mockRestore();
    mongoClose.mockRestore();
  });

  it('debería obtener las órdenes correctamente', async () => {
    const waiterUser = { role: 'waiter' };
    const createOrderSpy = jest.spyOn(ordersController, 'createOrder').mockResolvedValue(waiterUser);

    const orders = await ordersController.getOrders();
    expect(Array.isArray(orders)).toBe(true);
    // Verifica que cada orden en la lista de órdenes coincida con la orden creada
    orders.forEach((order, index) => {
      expect(order).toHaveProperty('orderId', ordersData[index].orderId);
      expect(order).toHaveProperty('items', ordersData[index].items);
      expect(order).toHaveProperty('total', ordersData[index].total);
      expect(order).toHaveProperty('customerName', ordersData[index].customerName);
      expect(order).toHaveProperty('customerTable', ordersData[index].customerTable);
    });
    createOrderSpy.mockRestore();
  });
});

describe('getOrderById', () => {
  let collectionMock;

  beforeEach(() => {
    collectionMock = jest.fn().mockReturnValue({
      findOne: jest.fn(),
    });
    mongoConnect.mockResolvedValue({
      collection: collectionMock,
    });
  });

  afterEach(() => {
    mongoConnect.mockRestore();
    mongoClose.mockRestore();
  });

  it('debería obtener una orden por su ID', async () => {
    const orderData = {
      orderId: '123456',
      items: [
        { name: 'Pizza', quantity: 2, price: 10.99 },
        { name: 'Burger', quantity: 1, price: 5.99 },
      ],
      total: 27.97,
      customerName: 'Pepito Pérez',
      customerTable: '5',
    };

    collectionMock().findOne.mockResolvedValue(orderData);

    const orderId = '313233343536373839303132';
    const order = await ordersController.getOrderById(orderId);

    expect(mongoConnect).toHaveBeenCalledTimes(1);
    expect(collectionMock().findOne).toHaveBeenCalledWith({ _id: new ObjectId(orderId) });
    expect(order).toEqual(orderData);
    expect(mongoClose).toHaveBeenCalledTimes(1);
  });

  it('debería devolver nulo cuando no exista el ID de la orden', async () => {
    collectionMock().findOne.mockResolvedValue(null);

    const orderId = '313233343536373839303132';
    const order = await ordersController.getOrderById(orderId);

    expect(mongoConnect).toHaveBeenCalledTimes(1);
    expect(collectionMock().findOne).toHaveBeenCalledWith({ _id: new ObjectId(orderId) });
    expect(order).toBeNull();
    expect(mongoClose).toHaveBeenCalledTimes(1);
  });
});

describe('updateOrder', () => {
  let collectionMock;

  beforeEach(() => {
    collectionMock = jest.fn().mockReturnValue({
      updateOne: jest.fn(),
    });
    mongoConnect.mockResolvedValue({
      collection: collectionMock,
    });
  });

  afterEach(() => {
    mongoConnect.mockRestore();
    mongoClose.mockRestore();
  });

  it('debería editar una orden por su ID', async () => {
    const updatedOrderId = '313233343536373839303132';
    const updatedOrderData = {
      items: [
        { name: 'Pizza', quantity: 2, price: 10.99 },
        { name: 'Burger', quantity: 1, price: 5.99 },
      ],
      total: 27.97,
      customerName: 'Pepito Pérez',
      customerTable: '5',
    };
    const updateResult = {
      matchedCount: 1
    }

    collectionMock().updateOne.mockResolvedValue(updateResult);

    const result = await ordersController.updateOrder(updatedOrderId, updatedOrderData);

    expect(mongoConnect).toHaveBeenCalledTimes(1);
    expect(collectionMock().updateOne).toHaveBeenCalledWith(
      { _id: new ObjectId(updatedOrderId) },
      { $set: updatedOrderData }
    );
    expect(result).toEqual(updateResult);
    expect(mongoClose).toHaveBeenCalledTimes(1);
  });

  it('debería devolver un error cuando no exista el ID de la orden', async () => {
    const updatedOrderId = '313233343536373839303132';
    const updatedOrderData = {}

    collectionMock().updateOne.mockImplementation(() => {
      throw new AppError(404, 'Orden no encontrada');
    });

    const result = ordersController.updateOrder(updatedOrderId, updatedOrderData);
    await expect(result).rejects.toThrow(AppError);

    expect(mongoConnect).toHaveBeenCalledTimes(1);
    expect(collectionMock().updateOne).toHaveBeenCalledWith(
      { _id: new ObjectId(updatedOrderId) },
      { $set: updatedOrderData }
    );
    expect(mongoClose).toHaveBeenCalledTimes(1);
  });
});
