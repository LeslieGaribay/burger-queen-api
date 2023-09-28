const { writeFileSync } = require('fs');
const { v4: uuid } = require('uuid');

module.exports = {
  saveImageLocally: async (imageBlob) => { // BLOB = Binary Large OBject
    imageBlob = imageBlob.replace('data:image/png;base64,', '')
    const imageFileName = uuid();
    const imageFilePath = `./img-data/${imageFileName}.png`;
    const imageUrl = `/img/${imageFileName}.png`;
    try {
      // Esta es la versión manual:
      // let imageFileArrayBuffer = Buffer.from(imageBlob, 'base64');
      // writeFileSync(`./img-data/${imageFileName}.png`, imageFileArrayBuffer);
      // Y esta es la versión sencilla:
      writeFileSync(imageFilePath, imageBlob, 'base64');
      return imageUrl;
    } catch (error) {
      console.error('Error al guardar la imagen localmente', error);
      throw error;
    }
  }
}
