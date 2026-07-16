const db = require('../config/database');
const bcrypt = require('bcryptjs');

exports.getAll = (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, email, nombre, office, avatar, role, created_at FROM usuarios WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (nombre LIKE ? OR email LIKE ? OR office LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    // Get total count for pagination metadata
    let countQuery = 'SELECT COUNT(*) as total FROM (' + query + ')';
    const totalCount = db.prepare(countQuery).get(...params).total;

    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const users = db.prepare(query).all(...params);

    res.json({ 
      success: true, 
      data: users, 
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.getById = (req, res) => {
  try {
    const user = db.prepare('SELECT id, email, nombre, office, avatar, role, created_at FROM usuarios WHERE id = ?').get(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Usuario no encontrado.' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.update = (req, res) => {
  try {
    const { nombre, office, avatar, role } = req.body;
    const user = db.prepare('SELECT id FROM usuarios WHERE id = ?').get(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Usuario no encontrado.' });

    db.prepare(`
      UPDATE usuarios SET
        nombre = COALESCE(?, nombre),
        office = COALESCE(?, office),
        avatar = COALESCE(?, avatar),
        role = COALESCE(?, role)
      WHERE id = ?
    `).run(nombre, office, avatar, role, req.params.id);

    const updated = db.prepare('SELECT id, email, nombre, office, avatar, role, created_at FROM usuarios WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: updated, message: 'Usuario actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.delete = (req, res) => {
  try {
    const user = db.prepare('SELECT id FROM usuarios WHERE id = ?').get(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Usuario no encontrado.' });

    db.prepare('DELETE FROM usuarios WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

const mapRoleToDB = (role) => {
  if (!role) return 'operador';
  const clean = role.toLowerCase().trim();
  const map = {
    'administrador': 'admin',
    'admin': 'admin',
    'recepcion': 'operador',
    'recepción': 'operador',
    'operador': 'operador',
    'empacador': 'supervisor',
    'supervisor': 'supervisor',
    'repartidor': 'conductor',
    'conductor': 'conductor'
  };
  return map[clean] || 'operador';
};

exports.create = (req, res) => {
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
    const dbRole = mapRoleToDB(role);

    const result = db.prepare(`
      INSERT INTO usuarios (email, password, nombre, office, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(email, hash, nombre, office || 'Despensa Norte', dbRole);

    const newUser = db.prepare('SELECT id, email, nombre, office, role, created_at FROM usuarios WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({
      success: true,
      data: newUser,
      message: 'Usuario creado exitosamente.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
};
