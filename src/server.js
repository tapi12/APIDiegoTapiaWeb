/*Función: Archivo principal donde configuras y ejecutas tu servidor Express. Aquí es donde importas las rutas y los middlewares, y defines el puerto en el que tu aplicación escuchará.
Uso: Este es el archivo que ejecutas para iniciar tu aplicación. */
// server.js
const express = require('express');
const dotenv = require('dotenv'); // Asegúrate de incluir dotenv
const usuarioRoutes = require('./routes/usuarioRoutes'); // Asegúrate de que la ruta sea correcta

// Cargar variables de entorno desde .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Usa una variable de entorno para el puerto

// Middleware para procesar JSON

const cors = require('cors');

// Permitir todas las solicitudes desde cualquier origen
app.use(cors());


app.use(express.json());

// Usar rutas
app.use('/api/usuarios', usuarioRoutes);

// Manejo de errores (opcional, pero recomendado)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Algo salió mal!' });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
