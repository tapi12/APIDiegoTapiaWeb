/*Función: Contiene la lógica de negocio relacionada con los usuarios. Aquí defines las funciones que se ejecutarán cuando se llamen las rutas de usuarios.
Uso: Este archivo es importado por las rutas para manejar las solicitudes y respuestas. */

const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secretKey = 'your_secret_key'; // Clave secreta para firmar el JWT

// Obtener todos los usuarios
exports.getUsuarios = (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

// Otras funciones relacionadas con los usuarios pueden ir aquí

// Verificar si un usuario existe
exports.verificarUsuario = (req, res) => {
    const { email } = req.body; // Verifica que se está recibiendo correctamente el email
    console.log('Email recibido:', email);
  
    if (!email) {
      return res.status(400).json({ error: 'Email es requerido' });
    }
  
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Error en la consulta:', err.message); // Log del error en la consulta
        return res.status(500).json({ error: err.message });
      }
      if (results.length > 0) {
        console.log('El usuario existe');
        // El usuario existe
        return res.status(200).json({ existe: true });
      } else {
        console.log('El usuario no existe');
        // El usuario no existe
        return res.status(200).json({ existe: false });
      }
    });
  };
  

// Crear un nuevo usuario
exports.crearUsuario = (req, res) => {
    console.log('Entra en crearUsuario');
    const { name, email, password } = req.body; // Asumiendo que pasas nombre, correo y contraseña

    const hashedPassword = bcrypt.hashSync(password, 8);

    db.query('INSERT INTO usuarios (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.status(201).json({ message: 'Usuario creado exitosamente' });
    });
};


// Login de usuario con generación de token
exports.loginUsuario = (req, res) => {
  console.log('Entra en loginUsuario');
  const { email, password } = req.body;

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      console.log("usuario no encontrado");
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const usuario = results[0];
    // Verificar la contraseña
    if (!bcrypt.compareSync(password, usuario.password)) {
      console.log("Contraseña incorrecta", usuario.password, "/=", password);
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar el token JWT (expira en 30 minutos)
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, secretKey, { expiresIn: '30m' });

    // Enviar el token al cliente
    console.log("Enviar el token al cliente");
    return res.status(200).json({ token, message: 'Login exitoso' });
  });
};

// Middleware para verificar el token en las rutas protegidas
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extrae el token del header Authorization
  if (!token) {
    return res.status(403).json({ message: 'Token requerido' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
    req.userId = decoded.id;
    next();
  });
};


exports.getPerfilUsuario = (req, res) => {
    const userId = req.userId; // Obtiene el ID del usuario del token verificado
    db.query('SELECT id, name, email FROM usuarios WHERE id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(results[0]); // Retorna solo la información del usuario
    });
};



