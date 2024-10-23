/*Función: Aquí se define la conexión a la base de datos. Contiene la configuración necesaria para conectar tu aplicación a MySQL.
Uso: Este archivo es importado en otros archivos (por ejemplo, en controladores) para realizar operaciones con la base de datos. */

// db.js
require('dotenv').config(); // Cargar variables de entorno
const mysql = require('mysql2');

// Crear un pool de conexiones a la base de datos
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Número máximo de conexiones en el pool
    queueLimit: 0 // Sin límite en la cola de espera
});

// Verificar conexión al pool
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error conectando a la base de datos: ' + err.stack);
        process.exit(1); // Salir del proceso si hay un error crítico
    }
    console.log('Conectado a la base de datos como ID ' + connection.threadId);
    connection.release(); // Liberar la conexión de vuelta al pool
});

// Exportar el pool para usarlo en otros archivos
module.exports = pool;

