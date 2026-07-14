const db = require('../config/database');

exports.getAll = (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM incidencias WHERE 1=1';
    const params = [];

    if (status) { query += ' AND status = ?'; params.push(status); }

    query += ' ORDER BY created_at DESC';
    const incidencias = db.prepare(query).all(...params);
    res.json({ success: true, data: incidencias, total: incidencias.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.getById = (req, res) => {
  try {
    const incidencia = db.prepare('SELECT * FROM incidencias WHERE id = ?').get(req.params.id);
    if (!incidencia) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Incidencia no encontrada.' });
    res.json({ success: true, data: incidencia });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.create = (req, res) => {
  try {
    const { title, unit } = req.body;
    if (!title || !unit) return res.status(400).json({ success: false, error: 'Datos incompletos', message: 'Se requiere title y unit.' });

    const codigo = `INC-${String(Math.floor(1 + Math.random() * 999)).padStart(2, '0')}`;

    const result = db.prepare(`
      INSERT INTO incidencias (codigo, title, unit, status)
      VALUES (?, ?, ?, 'active')
    `).run(codigo, title, unit);

    const newIncidencia = db.prepare('SELECT * FROM incidencias WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: newIncidencia, message: 'Incidencia registrada correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.resolver = (req, res) => {
  try {
    const incidencia = db.prepare('SELECT * FROM incidencias WHERE id = ?').get(req.params.id);
    if (!incidencia) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Incidencia no encontrada.' });

    if (incidencia.status === 'reviewed') {
      return res.status(400).json({ success: false, error: 'Ya resuelta', message: 'Esta incidencia ya fue revisada.' });
    }

    db.prepare("UPDATE incidencias SET status = 'reviewed' WHERE id = ?").run(req.params.id);

    const updated = db.prepare('SELECT * FROM incidencias WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: updated, message: 'Incidencia revisada y resuelta correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};
