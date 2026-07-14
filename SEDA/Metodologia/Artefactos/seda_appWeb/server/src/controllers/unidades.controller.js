const db = require('../config/database');

exports.getAll = (req, res) => {
  try {
    const { type, search } = req.query;
    let query = 'SELECT * FROM unidades WHERE 1=1';
    const params = [];

    if (type) { query += ' AND type = ?'; params.push(type); }
    if (search) { query += ' AND (driver LIKE ? OR codigo LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

    query += ' ORDER BY created_at DESC';
    const unidades = db.prepare(query).all(...params);
    res.json({ success: true, data: unidades, total: unidades.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.getById = (req, res) => {
  try {
    const unidad = db.prepare('SELECT * FROM unidades WHERE id = ?').get(req.params.id);
    if (!unidad) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Unidad no encontrada.' });
    res.json({ success: true, data: unidad });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.create = (req, res) => {
  try {
    const { codigo, driver, type, capacity, load_percentage, temp, eta, status_badge, location } = req.body;
    if (!driver || !type || !capacity) return res.status(400).json({ success: false, error: 'Datos incompletos', message: 'Se requiere driver, type y capacity.' });

    const finalCodigo = codigo || `${type === 'Refrigerado' ? 'TR' : 'CV'}-${String(Math.floor(1 + Math.random() * 99)).padStart(2, '0')}`;

    const result = db.prepare(`
      INSERT INTO unidades (codigo, driver, type, capacity, load_percentage, temp, eta, status_badge, location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(finalCodigo, driver, type, capacity, load_percentage || 0, temp || null, eta || null, status_badge || null, location || null);

    const newUnidad = db.prepare('SELECT * FROM unidades WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: newUnidad, message: 'Unidad creada correctamente.' });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      return res.status(409).json({ success: false, error: 'Conflicto', message: 'Ya existe una unidad con ese código.' });
    }
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.update = (req, res) => {
  try {
    const unidad = db.prepare('SELECT id FROM unidades WHERE id = ?').get(req.params.id);
    if (!unidad) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Unidad no encontrada.' });

    const { driver, type, capacity, load_percentage, temp, eta, status_badge, location } = req.body;
    db.prepare(`
      UPDATE unidades SET
        driver = COALESCE(?, driver), type = COALESCE(?, type), capacity = COALESCE(?, capacity),
        load_percentage = COALESCE(?, load_percentage), temp = COALESCE(?, temp),
        eta = COALESCE(?, eta), status_badge = COALESCE(?, status_badge), location = COALESCE(?, location)
      WHERE id = ?
    `).run(driver, type, capacity, load_percentage, temp, eta, status_badge, location, req.params.id);

    const updated = db.prepare('SELECT * FROM unidades WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: updated, message: 'Unidad actualizada correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.delete = (req, res) => {
  try {
    const unidad = db.prepare('SELECT id FROM unidades WHERE id = ?').get(req.params.id);
    if (!unidad) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Unidad no encontrada.' });

    db.prepare('DELETE FROM unidades WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Unidad eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};
