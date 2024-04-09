const express = require('express');
const router = require('../router/jugador.router');
const path = require('path'); // Importar el módulo path

const app = express();

app.set('view engine', 'ejs');
app.set('views', ('src/views'));
app.use(express.static('src/public'));


app.get('/', (req, res) => {
    res.send('express');
});

app.use(express.json()); // Middleware para analizar el cuerpo de la solicitud como JSON

app.use('/', router); // Enrutador de jugadores

module.exports = app;
