const productsController = require('../products-controller');

describe('getProducts', () => {
  it('debería obtener una lista de productos', async () => {
    const getProductsMock = jest.spyOn(productsController, 'getProducts').mockResolvedValue([
      { _id: '1', name: 'Producto 1' },
      { _id: '2', name: 'Producto 2' },
    ]);
    const productList = await productsController.getProducts();

    expect(Array.isArray(productList)).toBe(true);
    expect(productList.length).toBeGreaterThan(0);

    getProductsMock.mockRestore();
  });

  it('debería manejar errores al obtener una lista de productos', async () => {
    const getProductsMock = jest.spyOn(productsController, 'getProducts').mockRejectedValue(new Error('Error simulado al obtener productos'));

    try {
      await productsController.getProducts();
    } catch (error) {
      expect(error.message).toBe('Error simulado al obtener productos');
    }
    getProductsMock.mockRestore();
  });
});

describe('addProduct', () => {
  it('debería agregar un producto nuevo a la db', async () => {
    const addProductMock = jest.spyOn(productsController, 'addProduct').mockResolvedValue({ insertedId: '123' });
    const newProduct = {
      _id: '123',
      name: 'xxx',
      type: 'xxx',
      price: '150',
    };

    const result = await productsController.addProduct(newProduct);

    expect(result.insertedId).toBeDefined();
    addProductMock.mockRestore();
  });

  it('debería manejar errores al agregar un producto', async () => {
    const addProductMock = jest.spyOn(productsController, 'addProduct').mockRejectedValue(new Error('Error simulado al agregar producto'));

    const invalidProduct = {
      name: 'abc',
      price: '150',
    };

    try {
      await productsController.addProduct(invalidProduct);
    } catch (error) {
      expect(error.message).toBe('Error simulado al agregar producto');
    }
    addProductMock.mockRestore();
  });
});

describe('getProduct', () => {
  it('debería obtener un producto por ID', async () => {
    const getProductMock = jest.spyOn(productsController, 'getProduct').mockResolvedValue({ _id: '123', name: 'Nombre de producto' });

    const productId = '65010275b21e856cd2f23e58';
    const product = await productsController.getProduct(productId);

    expect(product).toBeDefined();
    expect(product.name).toBeDefined();

    getProductMock.mockRestore();
  });

  it('debería manejar errores al obtener un producto', async () => {
    const getProductMock = jest.spyOn(productsController, 'getProduct').mockRejectedValue(new Error('Error simulado al obtener producto'));

    const invalidId = '65010275b21e8';

    try {
      await productsController.getProduct(invalidId);
    } catch (error) {
      expect(error.message).toBe('Error simulado al obtener producto');
    }
    getProductMock.mockRestore();
  });
});

describe('updateProduct', () => {
  it('debería actualizar un producto existente', async () => {
    const updateProductMock = jest.spyOn(productsController, 'updateProduct').mockResolvedValue({ modifiedCount: 1 });

    const productId = '65010275b21e856cd2f23e58';
    const updatedProductData = {
      _id: productId,
      name: 'Nombre actualizado',
      type: 'Tipo actualizado',
      price: 'Precio actualizado',
    };

    const result = await productsController.updateProduct(productId, updatedProductData);

    expect(result.modifiedCount).toBe(1);
    updateProductMock.mockRestore();
  });

  it('debería manejar errores al actualizar un producto', async () => {
    const updateProductMock = jest.spyOn(productsController, 'updateProduct').mockRejectedValue(new Error('Error simulado al actualizar producto'));

    const invalidId = '0';

    try {
      await productsController.updateProduct(invalidId, {});
    } catch (error) {
      expect(error.message).toBe('Error simulado al actualizar producto');
    }
    updateProductMock.mockRestore();
  });
});

describe('deleteProduct', () => {
  it('debería eliminar un producto', async () => {
    const deleteProductMock = jest.spyOn(productsController, 'deleteProduct').mockResolvedValue({ deletedCount: 1 });

    const productId = '650104c2b21e856cd2f23e5b';
    const result = await productsController.deleteProduct(productId);

    expect(result.deletedCount).toBe(1);
    deleteProductMock.mockRestore();
  });

  it('debería manejar errores al eliminar un producto', async () => {
    const deleteProductMock = jest.spyOn(productsController, 'deleteProduct').mockRejectedValue(new Error('Error simulado al eliminar producto'));

    const invalidId = '650102';

    try {
      await productsController.deleteProduct(invalidId);
    } catch (error) {
      expect(error.message).toBe('Error simulado al eliminar producto');
    }
    deleteProductMock.mockRestore();
  });
});
