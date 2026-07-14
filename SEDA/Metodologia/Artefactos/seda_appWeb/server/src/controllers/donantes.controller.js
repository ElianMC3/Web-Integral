const db = require('../config/database');

exports.getAll = (req, res) => {
  try {
    const { tipo, categoria, search } = req.query;
    let query = 'SELECT * FROM donantes WHERE 1=1';
    const params = [];

    if (tipo) { query += ' AND tipo = ?'; params.push(tipo); }
    if (categoria) { query += ' AND categoria = ?'; params.push(categoria); }
    if (search) { query += ' AND (nombre LIKE ? OR empresa LIKE ? OR rfc LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

    query += ' ORDER BY created_at DESC';
    const donantes = db.prepare(query).all(...params);
    res.json({ success: true, data: donantes, total: donantes.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.getById = (req, res) => {
  try {
    const donante = db.prepare('SELECT * FROM donantes WHERE id = ?').get(req.params.id);
    if (!donante) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Donante no encontrado.' });
    res.json({ success: true, data: donante });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.create = (req, res) => {
  try {
    const { nombre, empresa, rfc, telefono, email, direccion, categoria, tipo, notas } = req.body;
    if (!nombre) return res.status(400).json({ success: false, error: 'Datos incompletos', message: 'El campo nombre es requerido.' });

    const result = db.prepare(`
      INSERT INTO donantes (nombre, empresa, rfc, telefono, email, direccion, categoria, tipo, notas)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(nombre, empresa || null, rfc || null, telefono || null, email || null, direccion || null, categoria || 'Categoría A', tipo || 'Recurrente', notas || null);

    const newDonante = db.prepare('SELECT * FROM donantes WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: newDonante, message: 'Donante registrado correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.update = (req, res) => {
  try {
    const donante = db.prepare('SELECT id FROM donantes WHERE id = ?').get(req.params.id);
    if (!donante) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Donante no encontrado.' });

    const { nombre, empresa, rfc, telefono, email, direccion, categoria, tipo, notas } = req.body;
    db.prepare(`
      UPDATE donantes SET
        nombre = COALESCE(?, nombre), empresa = COALESCE(?, empresa), rfc = COALESCE(?, rfc),
        telefono = COALESCE(?, telefono), email = COALESCE(?, email), direccion = COALESCE(?, direccion),
        categoria = COALESCE(?, categoria), tipo = COALESCE(?, tipo), notas = COALESCE(?, notas)
      WHERE id = ?
    `).run(nombre, empresa, rfc, telefono, email, direccion, categoria, tipo, notas, req.params.id);

    const updated = db.prepare('SELECT * FROM donantes WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: updated, message: 'Donante actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.delete = (req, res) => {
  try {
    const donante = db.prepare('SELECT id FROM donantes WHERE id = ?').get(req.params.id);
    if (!donante) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Donante no encontrado.' });

    db.prepare('DELETE FROM donantes WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Donante eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};
