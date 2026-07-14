const db = require('../config/database');

exports.getAll = (req, res) => {
  try {
    const { columna, status, search } = req.query;
    let query = 'SELECT * FROM lotes WHERE 1=1';
    const params = [];

    if (columna) { query += ' AND columna = ?'; params.push(columna); }
    if (status) { query += ' AND status = ?'; params.push(status); }
    if (search) { query += ' AND (title LIKE ? OR codigo LIKE ? OR donor LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

    query += ' ORDER BY created_at DESC';
    const lotes = db.prepare(query).all(...params);
    res.json({ success: true, data: lotes, total: lotes.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.getById = (req, res) => {
  try {
    const lote = db.prepare('SELECT * FROM lotes WHERE id = ?').get(req.params.id);
    if (!lote) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Lote no encontrado.' });
    res.json({ success: true, data: lote });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.create = (req, res) => {
  try {
    const { title, donor, weight, due_date, status, columna, assigned_to, donacion_id } = req.body;
    if (!title) return res.status(400).json({ success: false, error: 'Datos incompletos', message: 'El campo title es requerido.' });

    const codigo = `LOTE-${Math.floor(9000 + Math.random() * 1000)}`;

    const result = db.prepare(`
      INSERT INTO lotes (codigo, title, donor, weight, due_date, status, columna, assigned_to, donacion_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(codigo, title, donor || null, weight || null, due_date || 'Sin fecha', status || 'Sin asignar', columna || 'PENDIENTE', assigned_to || null, donacion_id || null);

    const newLote = db.prepare('SELECT * FROM lotes WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: newLote, message: 'Lote creado correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.update = (req, res) => {
  try {
    const lote = db.prepare('SELECT id FROM lotes WHERE id = ?').get(req.params.id);
    if (!lote) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Lote no encontrado.' });

    const { title, donor, weight, due_date, status, columna, progress, location, assigned_to } = req.body;
    db.prepare(`
      UPDATE lotes SET
        title = COALESCE(?, title), donor = COALESCE(?, donor), weight = COALESCE(?, weight),
        due_date = COALESCE(?, due_date), status = COALESCE(?, status), columna = COALESCE(?, columna),
        progress = COALESCE(?, progress), location = COALESCE(?, location), assigned_to = COALESCE(?, assigned_to)
      WHERE id = ?
    `).run(title, donor, weight, due_date, status, columna, progress, location, assigned_to, req.params.id);

    const updated = db.prepare('SELECT * FROM lotes WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: updated, message: 'Lote actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.mover = (req, res) => {
  try {
    const lote = db.prepare('SELECT * FROM lotes WHERE id = ?').get(req.params.id);
    if (!lote) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Lote no encontrado.' });

    const { columna } = req.body;
    if (!columna) return res.status(400).json({ success: false, error: 'Datos incompletos', message: 'Se requiere el campo columna.' });

    let updates = { columna };

    // Business logic from the frontend store
    if (columna === 'EN_PROCESO') {
      updates.progress = 10;
      updates.location = `Mesa ${Math.floor(1 + Math.random() * 5)}`;
      updates.assigned_to = updates.assigned_to || 'Carlos D.';
    } else if (columna === 'CONTROL_CALIDAD') {
      updates.status = 'Esperando Inspector';
    }

    db.prepare(`
      UPDATE lotes SET columna = ?, progress = COALESCE(?, progress), location = COALESCE(?, location),
        assigned_to = COALESCE(?, assigned_to), status = COALESCE(?, status)
      WHERE id = ?
    `).run(updates.columna, updates.progress || null, updates.location || null, updates.assigned_to || null, updates.status || null, req.params.id);

    const updated = db.prepare('SELECT * FROM lotes WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: updated, message: `Lote movido a columna: ${columna}` });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.delete = (req, res) => {
  try {
    const lote = db.prepare('SELECT id FROM lotes WHERE id = ?').get(req.params.id);
    if (!lote) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Lote no encontrado.' });

    db.prepare('DELETE FROM lotes WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Lote eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};
