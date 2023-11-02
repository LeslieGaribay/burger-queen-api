# API de Burger Queen 🍔

Bienvenido a la documentación de la API de Burger Queen. Esta API respalda la funcionalidad del sistema de gestión de pedidos de la hamburguesería Burger Queen.

## Introducción 

La API de Burger Queen permite realizar diversas operaciones relacionadas con la gestión de pedidos, menús, usuarios y más. Facilita la comunicación entre el frontend y la base de datos, brindando una experiencia de usuario fluida.

## Endpoints Principales 🎯

- `/orders`: Gestión de pedidos, incluyendo creación, actualización y eliminación de pedidos.
- `/products`: Operaciones relacionadas con el menú de productos disponibles.
- `/users`: Administración de usuarios, incluyendo creación y gestión de roles.

## Tecnologías Utilizadas 👩‍💻

En el desarrollo de la API de Burger Queen, hemos utilizado las siguientes tecnologías:

 ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=plastic&logo=javascript&logoColor=%23F7DF1E)  ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=plastic&logo=express&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=plastic&logo=node.js&logoColor=white) ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=plastic&logo=react-router&logoColor=white)  ![Nodemon](https://img.shields.io/badge/NODEMON-%23323330.svg?style=plastic&logo=nodemon&logoColor=%BBDEAD) ![JWT](https://img.shields.io/badge/JWT-black?style=plastic&logo=JSON%20web%20tokens)  ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=plastic&logo=mongodb&logoColor=white)  ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=plastic&logo=docker&logoColor=white) ![GIT](https://img.shields.io/badge/Git-fc6d26?style=plastic&logo=git&logoColor=white) ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=plastic&logo=postman&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=plastic&logo=eslint&logoColor=white)



- **Node.js**:
  Node.js se utilizó como el entorno de ejecución principal para desarrollar la API de Burger Queen. Gracias a Node.js, pudimos construir un servidor web altamente eficiente que puede manejar múltiples solicitudes de manera simultánea. Node.js también nos permitió aprovechar el ecosistema de JavaScript tanto en el lado del servidor como en el cliente, lo que facilitó la sincronización de código.

- **Express.js**:
  Express.js desempeñó un papel fundamental en la API de Burger Queen. Lo utilizamos para crear rutas, gestionar solicitudes HTTP y definir middleware personalizado. Gracias a Express.js, pudimos diseñar una API RESTful que responde a solicitudes de clientes, como realizar pedidos, administrar productos y gestionar usuarios. Las rutas definidas con Express.js se conectan a controladores que procesan las solicitudes y generan respuestas adecuadas.

- **MongoDB**:
  MongoDB fue la base de datos elegida para la API de Burger Queen. Utilizamos MongoDB para almacenar y administrar datos, como productos, usuarios y pedidos. Gracias a su esquema flexible y su capacidad para manejar datos en formato JSON (BSON), MongoDB fue una elección ideal para una aplicación en la que los datos pueden variar en estructura. Además, MongoDB es altamente escalable, lo que se adapta bien a las necesidades de un restaurante en crecimiento.

- **Docker**:
  Docker se utilizó para crear un entorno de contenedorizado para la API de Burger Queen. Esto simplifica el proceso de desarrollo y despliegue, ya que permite empacar la aplicación y sus dependencias en contenedores aislados. Docker Compose se empleó para administrar múltiples contenedores, incluyendo el contenedor de la aplicación y el contenedor de la base de datos MongoDB. Esto garantiza que la aplicación pueda ser ejecutada de manera consistente en diferentes entornos, desde el desarrollo hasta la producción.

- **Autenticación y autorización mediante JWT (JSON Web Tokens)**:
  JWT se utilizó para autenticar y autorizar a los usuarios de la API de Burger Queen. Cuando un usuario se autentica, la API genera un token JWT que se utiliza para verificar la identidad del usuario en las solicitudes posteriores. Esto garantiza que solo las personas autorizadas tengan acceso a ciertas rutas y recursos, como la administración de pedidos y productos. JWT proporciona una forma segura de transmitir información de autenticación entre el cliente y el servidor.

Estas tecnologías se han combinado para construir una API robusta, escalable y segura para la gestión de pedidos en Burger Queen. Cada una desempeña un papel fundamental en el funcionamiento de la aplicación.

## Documentación Detallada

Para obtener información detallada sobre cómo utilizar los endpoints y las rutas, consulta la [documentación completa aquí](https://app.swaggerhub.com/apis-docs/ssinuco/BurgerQueenAPI/2.0.0).

## Estado del Proyecto 🛠️⚙️

**En Desarrollo:** El proyecto de la API de Burger Queen está en proceso de desarrollo. Hasta ahora, hemos implementado una serie de endpoints y funcionalidades que permiten la gestión de usuarios, productos y órdenes a través de una interfaz de servidor web. Estamos muy cerca de completar este emocionante proyecto y estamos trabajando arduamente para garantizar su éxito.

**Tarea Pendiente:** El último paso pendiente en nuestro proyecto es la actualización del estado de la orden una vez que el chef marque el pedido como "listo para entregar". Esta funcionalidad es crucial para asegurarnos de que las órdenes estén debidamente registradas como preparadas y listas para servirse. Esta actualización es vital para la eficiencia y el funcionamiento fluido de la aplicación en un entorno en tiempo real.

Además, hemos implementado pruebas de integración que garantizan que todas las partes de la aplicación funcionen sin problemas cuando interactúan entre sí, lo que nos proporciona una sólida confianza en la calidad de nuestra API.

**Próximos Pasos:** Una vez que completemos la funcionalidad de actualizar el estado de la orden y aseguremos la estabilidad a través de nuestras pruebas de integración, estaremos listos para implementar esta solución en el restaurante y revolucionar su forma de gestionar los pedidos. 