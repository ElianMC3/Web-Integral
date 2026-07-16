const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'seda_jwt_secret_key_2026_banco_alimentos';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Datos incompletos',
        message: 'Se requiere email y password.'
      });
    }

    const user = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
        message: 'El email o la contraseña son incorrectos.'
      });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
        message: 'El email o la contraseña son incorrectos.'
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      office: user.office,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      success: true,
      token,
      usuario: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        office: user.office,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
};

exports.register = (req, res) => {
  try {
    const { email, password, nombre, office, role } = req.body;

    if (!email || !password || !nombre) {
      return res.status(400).json({
        success: false,
        error: 'Datos incompletos',
        message: 'Se requiere email, password y nombre.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Contraseña muy corta',
        message: 'La contraseña debe tener al menos 6 caracteres.'
      });
    }

    const existing = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Conflicto',
        message: 'Ya existe un usuario registrado con ese email.'
      });
    }

    const hash = bcrypt.hashSync(password, 10);
    const result = db.prepare(`
      INSERT INTO usuarios (email, password, nombre, office, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(email, hash, nombre, office || 'Despensa Norte', role || 'operador');

    const newUser = db.prepare('SELECT id, email, nombre, office, role, created_at FROM usuarios WHERE id = ?').get(result.lastInsertRowid);

    const payload = {
      id: newUser.id,
      email: newUser.email,
      nombre: newUser.nombre,
      office: newUser.office,
      role: newUser.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({
      success: true,
      token,
      usuario: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
};
