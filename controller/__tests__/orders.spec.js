const ordersController = require('../orders-controller');
const { ObjectId } = require('mongodb');

describe('createOrder', () => {
  it('should create an order when user is a waiter', async () => {
    // Crea un usuario con rol de mesero
    const waiterUser = {
      role: 'waiter',
    };

    // Crea una orden de prueba
    const orderToCreate = {
      cliente: 'Nombre del cliente',
      mesa: 'Número de mesa',
      productos: [
        {
          products_id: ObjectId('65086c3d0210a73abcc50cca'),
          nombre: 'sopa de chocolo',
          cantidad: 2,
          precio_unitario: 10.99,
        },
        // Otros productos en la orden
      ],
      total: 21.98,
      estado: 'pendiente',
      fecha: new Date('2023-09-22T12:00:00Z'),
    };

    // Llama a la función createOrder
    const createdOrder = await ordersController.createOrder(orderToCreate, waiterUser);

    // Verifica que la orden haya sido creada exitosamente
    expect(createdOrder).toBeDefined();
    expect(createdOrder._id).toBeDefined();
    expect(createdOrder.cliente).toBe(orderToCreate.cliente);
    expect(createdOrder.mesa).toBe(orderToCreate.mesa);
  });

  it('should throw an error when user is not a waiter', async () => {
    // Crea un usuario con un rol que no sea mesero (por ejemplo, chef)
    const nonWaiterUser = {
      role: 'chef',
    };

    // Crea una orden de prueba (esto puede ser cualquier orden, ya que la prueba se enfoca en el usuario)
    const orderToCreate = {
      cliente: 'Nombre del cliente',
      mesa: 'Número de mesa',
      productos: [
        {
          producto_id: ObjectId('id_del_producto'),
          nombre: 'Nombre del producto',
          cantidad: 2,
          precio_unitario: 10.99,
        },
        // Otros productos en la orden
      ],
      total: 21.98,
      estado: 'pendiente',
      fecha: new Date('2023-09-22T12:00:00Z'),
    };

    // Llama a la función createOrder y espera que arroje un error
    await expect(orderController.createOrder(orderToCreate, nonWaiterUser)).rejects.toThrowError();
  });
});