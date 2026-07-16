const db = require('../config/database');

exports.getAll = (req, res) => {
  try {
    const { type, level, resolved } = req.query;
    let query = 'SELECT * FROM alertas WHERE 1=1';
    const params = [];

    if (type) { query += ' AND type = ?'; params.push(type); }
    if (level) { query += ' AND level = ?'; params.push(level); }
    if (resolved !== undefined) { query += ' AND resolved = ?'; params.push(resolved === 'true' ? 1 : 0); }

    query += ' ORDER BY created_at DESC';
    const alertas = db.prepare(query).all(...params);
    // Convert resolved from integer to boolean for response
    const data = alertas.map(a => ({ ...a, resolved: !!a.resolved }));
    res.json({ success: true, data, total: data.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.getById = (req, res) => {
  try {
    const alerta = db.prepare('SELECT * FROM alertas WHERE id = ?').get(req.params.id);
    if (!alerta) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Alerta no encontrada.' });
    res.json({ success: true, data: { ...alerta, resolved: !!alerta.resolved } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.create = (req, res) => {
  try {
    const { type, title, level, description, details, contact_name } = req.body;
    if (!type || !title || !level) return res.status(400).json({ success: false, error: 'Datos incompletos', message: 'Se requiere type, title y level.' });

    const codigo = `ALERT-${String(Math.floor(1 + Math.random() * 999)).padStart(2, '0')}`;

    const result = db.prepare(`
      INSERT INTO alertas (codigo, type, title, level, description, details, resolved, contact_name)
      VALUES (?, ?, ?, ?, ?, ?, 0, ?)
    `).run(codigo, type, title, level, description || null, details || null, contact_name || null);

    const newAlerta = db.prepare('SELECT * FROM alertas WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: { ...newAlerta, resolved: false }, message: 'Alerta creada correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.resolver = (req, res) => {
  try {
    const alerta = db.prepare('SELECT * FROM alertas WHERE id = ?').get(req.params.id);
    if (!alerta) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Alerta no encontrada.' });

    if (alerta.resolved) {
      return res.status(400).json({ success: false, error: 'Ya resuelta', message: 'Esta alerta ya fue resuelta.' });
    }

    const { action } = req.body;
    if (!action) return res.status(400).json({ success: false, error: 'Datos incompletos', message: 'Se requiere el campo action (descripción de la acción tomada).' });

    db.prepare('UPDATE alertas SET resolved = 1 WHERE id = ?').run(req.params.id);

    // Create history entry for the resolution
    const histCodigo = `HIST-${Math.floor(10000 + Math.random() * 90000)}`;
    db.prepare(`
      INSERT INTO historial_rutas (codigo, driver, unit, action_text, lote, details, time, date, status_badge, status_color)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      histCodigo,
      'Sistema / Operador',
      'ALERT_RESOLUTION',
      'resolvió alerta de',
      alerta.title,
      `Acción: ${action} • ${alerta.description || ''}`,
      new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      new Date().toLocaleDateString('es-MX'),
      'Acción Ejecutada',
      'bg-blue-100 text-blue-800 border-blue-200'
    );

    const updated = db.prepare('SELECT * FROM alertas WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: { ...updated, resolved: true }, historial_creado: histCodigo, message: `Alerta resuelta con acción: ${action}` });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};
