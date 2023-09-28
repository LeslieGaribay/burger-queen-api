const { MongoClient } = require('mongodb');
const config = require('./config');

// eslint-disable-next-line no-unused-vars
const MONGODB_URI = config.dbUrl;
const client = new MongoClient(MONGODB_URI);

async function mongoConnect() {
  try {
    await client.connect();
    console.log('Conexión a MongoDB establecida');
    return client.db('burger_queen');
  } catch (error) {
    await client.close();
    console.error('Error al conectar a MongoDB:', error);
    throw error;
  }
}

function mongoClose() {
  return client.close();
}

module.exports = { mongoConnect, mongoClose };
