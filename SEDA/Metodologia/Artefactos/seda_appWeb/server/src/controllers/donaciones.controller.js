const db = require('../config/database');

exports.getAll = (req, res) => {
  try {
    const { status, category, donante_id, search } = req.query;
    let query = 'SELECT * FROM donaciones WHERE 1=1';
    const params = [];

    if (status) { query += ' AND status = ?'; params.push(status); }
    if (category) { query += ' AND category = ?'; params.push(category); }
    if (donante_id) { query += ' AND donante_id = ?'; params.push(donante_id); }
    if (search) { query += ' AND (donor_name LIKE ? OR codigo LIKE ? OR category LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

    query += ' ORDER BY created_at DESC';
    const donaciones = db.prepare(query).all(...params);
    res.json({ success: true, data: donaciones, total: donaciones.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.getById = (req, res) => {
  try {
    const donacion = db.prepare('SELECT * FROM donaciones WHERE id = ?').get(req.params.id);
    if (!donacion) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Donación no encontrada.' });
    res.json({ success: true, data: donacion });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.create = (req, res) => {
  try {
    const { donante_id, donor_name, category, weight, batch_number, expiration_date, temperature, vehicle_status, notes, evidence_name, status, issue_details } = req.body;

    if (!donor_name || !category || weight === undefined) {
      return res.status(400).json({ success: false, error: 'Datos incompletos', message: 'Se requiere donor_name, category y weight.' });
    }

    const codigo = `DON-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    // Determine status automatically if not provided
    let finalStatus = status || 'Pendiente Clasificación';
    let finalIssueDetails = issue_details || null;

    if (!status) {
      const tempNum = parseFloat(temperature);
      const isPerecedero = category.toLowerCase().includes('perecedero') || category.toLowerCase().includes('lácteo') || category.toLowerCase().includes('frío');
      if (isPerecedero && tempNum > 6) {
        finalStatus = 'Retenido';
        finalIssueDetails = `Temperatura de llegada límite (${tempNum}°C). Requiere inspección de calidad.`;
      } else if (category === 'Mixto' || !expiration_date) {
        finalStatus = 'Pendiente Clasificación';
      } else {
        finalStatus = 'Aprobado';
      }
    }

    const result = db.prepare(`
      INSERT INTO donaciones (codigo, donante_id, donor_name, category, weight, batch_number, expiration_date, temperature, vehicle_status, notes, evidence_name, status, issue_details, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(codigo, donante_id || null, donor_name, category, weight, batch_number || null, expiration_date || null, temperature || null, vehicle_status || 'Óptimo', notes || null, evidence_name || null, finalStatus, finalIssueDetails, timestamp);

    // Auto-create a corresponding Kanban task (lote)
    const loteCodigo = `LOTE-${Math.floor(9000 + Math.random() * 1000)}`;
    const isPerecedero = category.toLowerCase().includes('perecedero') || category.toLowerCase().includes('lácteo');
    db.prepare(`
      INSERT INTO lotes (codigo, title, donor, weight, due_date, status, columna, donacion_id)
      VALUES (?, ?, ?, ?, ?, ?, 'PENDIENTE', ?)
    `).run(loteCodigo, `${category} Recibidos`, donor_name, `${weight}kg`, expiration_date ? `Vence: ${expiration_date}` : 'Sin fecha', isPerecedero ? 'Frío' : 'Sin asignar', result.lastInsertRowid);

    const newDonacion = db.prepare('SELECT * FROM donaciones WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: newDonacion, lote_creado: loteCodigo, message: 'Donación registrada correctamente. Se creó un lote asociado.' });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      return res.status(409).json({ success: false, error: 'Conflicto', message: 'Ya existe una donación con ese código.' });
    }
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.update = (req, res) => {
  try {
    const donacion = db.prepare('SELECT id FROM donaciones WHERE id = ?').get(req.params.id);
    if (!donacion) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Donación no encontrada.' });

    const { donor_name, category, weight, batch_number, expiration_date, temperature, vehicle_status, notes, evidence_name, status, issue_details } = req.body;
    db.prepare(`
      UPDATE donaciones SET
        donor_name = COALESCE(?, donor_name), category = COALESCE(?, category), weight = COALESCE(?, weight),
        batch_number = COALESCE(?, batch_number), expiration_date = COALESCE(?, expiration_date),
        temperature = COALESCE(?, temperature), vehicle_status = COALESCE(?, vehicle_status),
        notes = COALESCE(?, notes), evidence_name = COALESCE(?, evidence_name),
        status = COALESCE(?, status), issue_details = COALESCE(?, issue_details)
      WHERE id = ?
    `).run(donor_name, category, weight, batch_number, expiration_date, temperature, vehicle_status, notes, evidence_name, status, issue_details, req.params.id);

    const updated = db.prepare('SELECT * FROM donaciones WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: updated, message: 'Donación actualizada correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.updateStatus = (req, res) => {
  try {
    const donacion = db.prepare('SELECT id FROM donaciones WHERE id = ?').get(req.params.id);
    if (!donacion) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Donación no encontrada.' });

    const { status, issue_details } = req.body;
    if (!status) return res.status(400).json({ success: false, error: 'Datos incompletos', message: 'Se requiere el campo status.' });

    db.prepare('UPDATE donaciones SET status = ?, issue_details = COALESCE(?, issue_details) WHERE id = ?')
      .run(status, issue_details, req.params.id);

    const updated = db.prepare('SELECT * FROM donaciones WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: updated, message: `Estado de donación actualizado a: ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.delete = (req, res) => {
  try {
    const donacion = db.prepare('SELECT id FROM donaciones WHERE id = ?').get(req.params.id);
    if (!donacion) return res.status(404).json({ success: false, error: 'No encontrado', message: 'Donación no encontrada.' });

    db.prepare('DELETE FROM donaciones WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Donación eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};
