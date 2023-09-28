const { readFileSync } = require('fs');
const path = require('path');

/** @module images */
module.exports = (app, nextMain) => {

  app.get('/img/:imageName', async (request, response, next) => {
    const imagePath = path.join('./img-data/', request.params.imageName);
    let img = readFileSync(imagePath);
    response.writeHead(200, {'Content-Type': 'image/png' });
    response.end(img, 'binary');
  });

  nextMain();
};
