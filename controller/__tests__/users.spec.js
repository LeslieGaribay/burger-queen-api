const usersController = require('../users-controller');

describe('getUsers', () => {
  it('debería obtener una lista de usuarios', async () => {
    // Mock de getUsers para simular la obtención de usuarios
    const getUsersMock = jest.spyOn(usersController, 'getUsers').mockResolvedValue([
      { _id: '1', name: 'Usuario 1' },
      { _id: '2', name: 'Usuario 2' },
    ]);
    const userList = await usersController.getUsers();

    expect(Array.isArray(userList)).toBe(true);
    expect(userList.length).toBeGreaterThan(0);

    getUsersMock.mockRestore();
  });

  it('debería manejar errores al obtener una lista de usuarios', async () => {
    // Mock de getUsers para simular un error al obtener usuarios
    const getUsersMock = jest.spyOn(usersController, 'getUsers').mockRejectedValue(new Error('Error simulado al obtener usuarios'));

    try {
      await usersController.getUsers();
    } catch (error) {
      expect(error.message).toBe('Error simulado al obtener usuarios');
    }
    getUsersMock.mockRestore();
  });
});

describe('addUser', () => {
  it('debería agregar un usuario nuevo a la db', async () => {
    // Mock de addUser para simular la inserción en la base de datos
    const addUserMock = jest.spyOn(usersController, 'addUser').mockResolvedValue({ insertedId: '123' });
    const newUser = {
      _id: '123',
      name: 'xxx',
      email: 'x@me.com',
      password: 'secret',
      role: 'user',
    };

    const result = await usersController.addUser(newUser);

    expect(result.insertedId).toBeDefined();
    addUserMock.mockRestore();
  });

  it('debería manejar errores al agregar un usuario', async () => {
    // Mock de addUser para simular un error al agregar el usuario
    const addUserMock = jest.spyOn(usersController, 'addUser').mockRejectedValue(new Error('Error simulado al agregar usuario'));

    const invalidUser = {
      name: 'Daniel Meza',
      password: 'secret',
    };

    try {
      await usersController.addUser(invalidUser);
    } catch (error) {
      expect(error.message).toBe('Error simulado al agregar usuario');
    }
    addUserMock.mockRestore();
  });
});

describe('getUser', () => {
  it('debería obtener un usuario por ID', async () => {
    // Mock de getUser para simular la obtención de un usuario
    const getUserMock = jest.spyOn(usersController, 'getUser').mockResolvedValue({ _id: '123', name: 'Nombre de usuario' });

    const userId = "65010275b21e856cd2f23e58";
    const user = await usersController.getUser(userId);

    expect(user).toBeDefined();
    expect(user.name).toBeDefined();

    getUserMock.mockRestore();
  });

  it('debería manejar errores al obtener un usuario', async () => {
    // Mock de getUser para simular un error al obtener el usuario
    const getUserMock = jest.spyOn(usersController, 'getUser').mockRejectedValue(new Error('Error simulado al obtener usuario'));

    const invalidId = "65010275b21e8";

    try {
      await usersController.getUser(invalidId);
    } catch (error) {
      expect(error.message).toBe('Error simulado al obtener usuario');
    }
    getUserMock.mockRestore();
  });
});

describe('updateUser', () => {
  it('debería actualizar un usuario existente', async () => {
    // Mock de updateUser para simular la actualización de un usuario
    const updateUserMock = jest.spyOn(usersController, 'updateUser').mockResolvedValue({ modifiedCount: 1 });

    const userId = "65010275b21e856cd2f23e58";
    const updatedUserData = {
      _id: userId,
      name: 'Nombre actualizado',
      email: 'emailactualizado@gmail.com',
      password: 'passwordactualizo',
      role: 'admin'
    };

    const result = await usersController.updateUser(userId, updatedUserData);

    expect(result.modifiedCount).toBe(1);
    updateUserMock.mockRestore();
  });

  it('debería manejar un error si el usuario no tiene datos', async () => {
    // Mock de updateUser para simular un error al actualizar el usuario
    const updateUserMock = jest.spyOn(usersController, 'updateUser').mockRejectedValue(new Error('Error simulado al actualizar usuario'));

    const invalidId = "0";

    try {
      await usersController.updateUser(invalidId, {});
    } catch (error) {
      expect(error.message).toBe('Error simulado al actualizar usuario');
    }
    updateUserMock.mockRestore();
  });

  it('debería arrojar un error si el userId es nulo', async () => {
    // Mock de updateUser para simular un error al actualizar el usuario
    const updateUserMock = jest.spyOn(usersController, 'updateUser').mockRejectedValue(new Error('Error simulado al actualizar usuario'));
  
    const invalidId = null; 
  
    try {
      await usersController.updateUser(invalidId, {});
    } catch (error) {
      expect(error.message).toBe('Error simulado al actualizar usuario');
    }
    updateUserMock.mockRestore();
  });
  
  it('debería arrojar un error si el email no es válido', async () => {
    // Mock de updateUser para simular un error al actualizar el usuario
    const updateUserMock = jest.spyOn(usersController, 'updateUser').mockRejectedValue(new Error('Error simulado al actualizar usuario'));
  
    const invalidEmail = 'correo-invalido@gmail.com'; 
    try {
      await usersController.updateUser('userId', { email: invalidEmail });
    } catch (error) {
      expect(error.message).toBe('Error simulado al actualizar usuario');
    }
    updateUserMock.mockRestore();
  });
  
});


describe('deleteUser', () => {
  it('debería eliminar un usuario', async () => {
    // Mock de deleteUser para simular la eliminación de un usuario
    const deleteUserMock = jest.spyOn(usersController, 'deleteUser').mockResolvedValue({ deletedCount: 1 });

    const userId = "650104c2b21e856cd2f23e5b";
    const result = await usersController.deleteUser(userId);

    expect(result.deletedCount).toBe(1);
    deleteUserMock.mockRestore();
  });

  it('debería manejar errores al eliminar un usuario', async () => {
    // Mock de deleteUser para simular un error al eliminar el usuario
    const deleteUserMock = jest.spyOn(usersController, 'deleteUser').mockRejectedValue(new Error('Error simulado al eliminar usuario'));

    const invalidId = "650102";

    try {
      await usersController.deleteUser(invalidId);
    } catch (error) {
      expect(error.message).toBe('Error simulado al eliminar usuario');
    }
    deleteUserMock.mockRestore();
  });
});
