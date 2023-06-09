'use strict';
// LET'S GO!

// Módulo que carga las variables del archivo .env en las variables de entorno
require('dotenv').config();

// Módulo para la creación de servidor http.
const express = require('express');
// Middleware log de eventos de express.
const morgan = require('morgan');
// Módulo para que no existan conflictos en la base de datos cuando se realicen  peticiones en el servidor local
const cors = require('cors');
// Middleware para la subida de archivos al servidor.
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();
app.use(fileUpload());
const { PORT } = process.env;

app.use(cors());
app.use(morgan('dev'));
app.use('/uploads', express.static('./uploads'));
//CONTROLADORES PARA LOS DISTINTOS MÉTODOS Y FUNCIONALIDADES

const staticDir = path.join(__dirname, './src/uploads');
app.use(express.static(staticDir));
// Controlador health
const healthRouter = require('./src/routes/healthRouter');
// Controladores de usuario
const userRouter = require('./src/routes/userRouter');
// Controladores de noticias
const newRouter = require('./src/routes/newRouter');
// Controladores de categorias
const categoryRouter = require('./src/routes/categoryRouter');

// Middleware para procesar datos tipo JSON de las peticiones
app.use(express.json());

// Ruta controlador health
app.use(healthRouter);
// Ruta controladores users
app.use(userRouter);
//  Ruta controladores news
app.use(newRouter);
// Ruta controladores category
app.use(categoryRouter);

//MIDDLEWARE DE GESTION DE ERRORES
app.use(function (error, req, res, next) {
  console.error(error);

  if (error) {
    res.status(error.httpStatus || 500).send({
      status: 'error',
      message: error.message,
    });
  }
});

//MIDDLEWARE DE GESTIÓN DE RUTA NO ENCONTRADA 404
app.use(function (req, res) {
  res.status(404).send({
    status: 'error',
    message: 'No se ha encontrado la ruta',
  });
});

// Lanzamos el servidor
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT} ❤️`));
