/*Función: Define las rutas específicas para los endpoints de la API relacionados con los usuarios (por ejemplo, obtener, crear, actualizar y eliminar usuarios).
Uso: Este archivo es importado en server.js para agregar las rutas a la aplicación Express. */

const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verifyToken } = require('../controllers/usuarioController');
// Ruta para obtener todos los usuarios
router.get('/', usuarioController.getUsuarios);

// Otras rutas para crear, actualizar o eliminar usuarios pueden ir aquí

// Ruta para verificar si un usuario existe
router.post('/existe', usuarioController.verificarUsuario);

// Ruta para crear un nuevo usuario
router.post('/crear', usuarioController.crearUsuario);

router.post('/login', usuarioController.loginUsuario);

router.get('/perfil', verifyToken, usuarioController.getPerfilUsuario);

module.exports = router;
