const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Esto permite solicitudes desde cualquier origen

module.exports = app;