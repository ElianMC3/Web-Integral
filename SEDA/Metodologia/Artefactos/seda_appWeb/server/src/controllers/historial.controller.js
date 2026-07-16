const db = require('../config/database');

exports.getAll = (req, res) => {
  try {
    const { search, date } = req.query;
    let query = 'SELECT * FROM historial_rutas WHERE 1=1';
    const params = [];

    if (search) { query += ' AND (driver LIKE ? OR lote LIKE ? OR details LIKE ? OR status_badge LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`); }
    if (date) { query += ' AND date = ?'; params.push(date); }

    query += ' ORDER BY created_at DESC';
    const historial = db.prepare(query).all(...params);
    res.json({ success: true, data: historial, total: historial.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.getById = (req, res) => {
  try {
    const registro = db.prepare('SELECT * FROM historial_rutas WHERE id = ?').get(req.params.id);
    if (!registro) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Registro histórico no encontrado.' });
    res.json({ success: true, data: registro });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.create = (req, res) => {
  try {
    const { driver, unit, action_text, lote, details, time, date, status_badge, status_color, extra_badge } = req.body;
    if (!driver || !unit || !action_text) return res.status(400).json({ success: false, error: 'Datos incompletos', message: 'Se requiere driver, unit y action_text.' });

    const codigo = `HIST-${Math.floor(10000 + Math.random() * 90000)}`;
    const finalTime = time || new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const finalDate = date || new Date().toLocaleDateString('es-MX');

    const result = db.prepare(`
      INSERT INTO historial_rutas (codigo, driver, unit, action_text, lote, details, time, date, status_badge, status_color, extra_badge)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(codigo, driver, unit, action_text, lote || null, details || null, finalTime, finalDate, status_badge || 'Registrado', status_color || 'bg-blue-100 text-blue-800 border-blue-200', extra_badge || null);

    const newRegistro = db.prepare('SELECT * FROM historial_rutas WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: newRegistro, message: 'Registro histórico creado correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};
