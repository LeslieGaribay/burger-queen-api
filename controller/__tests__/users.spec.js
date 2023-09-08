const {
  getUsers,
  addUser,
} = require('../users-controller');

// describe('getUsers', () => {
//   it('should get users collection', (done) => {
//     done();
//   });
// });


describe('getUsers', () => {
  it('debería obtener una lista de usuarios', async () => {
  
    // Llama a la función getUsers y verifica el resultado
    const userList = await getUsers();

    // Comprueba si userList es un arreglo
    expect(Array.isArray(userList)).toBe(true);
    expect(userList.length).toBeGreaterThan(0);

  });
});

describe('addUser', () => {
  it('debería agregar un usuario nuevo a la db', async () => {
    // Datos de ejemplo para el nuevo usuario
    const newUser = {
        name: 'Daniel Meza',
        email: 'd@meza.com',
        password: 'secret',
        role: 'user',
    };

    // Llama a la función addUser y verifica el resultado
    const result = await addUser(newUser);

    // Comprueba si se generó un _id para el usuario
    expect(result.insertedId).toBeDefined();
  });

  it('debería manejar errores al agregar un usuario', async () => {
    const invalidUser = {
      name: 'Daniel Meza',
      password: 'secret',
    };

    try {
        await addUser(invalidUser);
    } catch (error) {
        expect(error).toBeDefined();
    }
});
});

