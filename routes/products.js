const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

const {
  getProducts,
  addProduct,
  getProduct,
  deleteProduct,
  updateProduct
} = require('../controller/products-controller');

/** @module products */
module.exports = (app, nextMain) => {
  /**
   * @name GET /products
   * @description Lista productos
   * @path {GET} /products
   * @query {String} [page=1] Página del listado a consultar
   * @query {String} [limit=10] Cantitad de elementos por página
   * @header {Object} link Parámetros de paginación
   * @header {String} link.first Link a la primera página
   * @header {String} link.prev Link a la página anterior
   * @header {String} link.next Link a la página siguiente
   * @header {String} link.last Link a la última página
   * @auth Requiere `token` de autenticación
   * @response {Array} products
   * @response {String} products[]._id Id
   * @response {String} products[].name Nombre
   * @response {Number} products[].price Precio
   * @response {URL} products[].image URL a la imagen
   * @response {String} products[].type Tipo/Categoría
   * @response {Date} products[].dateEntry Fecha de creación
   * @code {200} si la autenticación es correcta
   * @code {401} si no hay cabecera de autenticación
   */
  app.get('/products', requireAuth, async (request, response, next) => {
    const { type } = request.query;
    
    try {
      const products = await getProducts(type);
      response.json(products);
    } catch (error) {
      response.status(500).json({ error: 'No se pudieron obtener los productos'});
    }
  });

  /**
   * @name GET /products/:productId
   * @description Obtiene los datos de un producto especifico
   * @path {GET} /products/:productId
   * @params {String} :productId `id` del producto
   * @auth Requiere `token` de autenticación
   * @response {Object} product
   * @response {String} product._id Id
   * @response {String} product.name Nombre
   * @response {Number} product.price Precio
   * @response {URL} product.image URL a la imagen
   * @response {String} product.type Tipo/Categoría
   * @response {Date} product.dateEntry Fecha de creación
   * @code {200} si la autenticación es correcta
   * @code {401} si no hay cabecera de autenticación
   * @code {404} si el producto con `productId` indicado no existe
   */
  app.get('/products/:productId', requireAuth, async (request, response, next) => {
    try {
      const product = await getProduct(request.params.productId);

      if (!product) {
        return response.status(404).json({ error: 'Producto no encontrado'});
      }
      response.json(product);
    } catch (error) {
      response.status(500).json({ error: 'No se pudo obtener el producto'});
    }
  });

  /**
   * @name POST /products
   * @description Crea un nuevo producto
   * @path {POST} /products
   * @auth Requiere `token` de autenticación y que la usuaria sea **admin**
   * @body {String} name Nombre
   * @body {Number} price Precio
   * @body {String} [imagen]  URL a la imagen
   * @body {String} [type] Tipo/Categoría
   * @response {Object} product
   * @response {String} products._id Id
   * @response {String} product.name Nombre
   * @response {Number} product.price Precio
   * @response {URL} product.image URL a la imagen
   * @response {String} product.type Tipo/Categoría
   * @response {Date} product.dateEntry Fecha de creación
   * @code {200} si la autenticación es correcta
   * @code {400} si no se indican `name` o `price`
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si no es admin
   * @code {404} si el producto con `productId` indicado no existe
   */
  app.post('/products', requireAdmin, async (request, response, next) => {

    const { name, price, type } = request.body;

    try {
      if (!name || !price || !type) {
        return response
          .status(400)
          .json({ message: 'Todos los campos son requeridos'});
      }

      const newProduct = {
        name,
        price,
        type,
      };

      const result = await addProduct(newProduct);

      if (result.insertedId) {
        return response
          .status(201)
          .json({ message: 'Producto agregado con éxito' });
        // si no rechaza peticion indicar el error
      } else {
        return response
          .status(400)
          .json({ message: 'Ha fallado la inserción' });
      }
    } catch (error) {
      console.error('Error al agregar el producto: ' + error);
      return response
        .status(500)
        .json({ message: 'Error al agregar el producto', error: error.message });
    }
  });

  /**
   * @name PUT /products
   * @description Modifica un producto
   * @path {PUT} /products
   * @params {String} :productId `id` del producto
   * @auth Requiere `token` de autenticación y que el usuario sea **admin**
   * @body {String} [name] Nombre
   * @body {Number} [price] Precio
   * @body {String} [imagen]  URL a la imagen
   * @body {String} [type] Tipo/Categoría
   * @response {Object} product
   * @response {String} product._id Id
   * @response {String} product.name Nombre
   * @response {Number} product.price Precio
   * @response {URL} product.image URL a la imagen
   * @response {String} product.type Tipo/Categoría
   * @response {Date} product.dateEntry Fecha de creación
   * @code {200} si la autenticación es correcta
   * @code {400} si no se indican ninguna propiedad a modificar
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si no es admin
   * @code {404} si el producto con `productId` indicado no existe
   */
  app.put('/products/:productId', requireAdmin, async (request, response, next) => {
    try {
      console.log(request.body);
      const updatedProduct = await updateProduct(
        request.params.productId,
        request.body,
      );
      if (!updatedProduct) {
        return response.status(404).json({ error: 'Producto no encontrado' });
      }
      response.json(updatedProduct);
    } catch (error) {
      response.status(500).json({ error: 'No se pudo actualizar el producto' });
    }
  });

  /**
   * @name DELETE /products
   * @description Elimina un producto
   * @path {DELETE} /products
   * @params {String} :productId `id` del producto
   * @auth Requiere `token` de autenticación y que el usuario sea **admin**
   * @response {Object} product
   * @response {String} product._id Id
   * @response {String} product.name Nombre
   * @response {Number} product.price Precio
   * @response {URL} product.image URL a la imagen
   * @response {String} product.type Tipo/Categoría
   * @response {Date} product.dateEntry Fecha de creación
   * @code {200} si la autenticación es correcta
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si no es ni admin
   * @code {404} si el producto con `productId` indicado no existe
   */
  app.delete('/products/:productId', requireAdmin, async (request, response, next) => {
    try {
      const deletedProduct = await deleteProduct(request.params.id); // *Product*

      if (!deletedProduct) {
        return response.status(404).json({ error: 'Producto no encontrado' });
      }

      response.json({ mensaje: 'Producto eliminado con éxito' });
    } catch (error) {
      response.status(500).json({ error: 'No se pudo eliminar el producto' });
    }
  });

  nextMain();
};
