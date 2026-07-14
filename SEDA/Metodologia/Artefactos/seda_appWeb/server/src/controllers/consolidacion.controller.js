const db = require('../config/database');

exports.getAll = (req, res) => {
  try {
    const { destination } = req.query;
    let query = 'SELECT * FROM consolidacion_items WHERE 1=1';
    const params = [];

    if (destination) { query += ' AND destination = ?'; params.push(destination); }

    query += ' ORDER BY created_at DESC';
    const items = db.prepare(query).all(...params);
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

    res.json({
      success: true,
      data: items,
      total: items.length,
      total_weight: totalWeight,
      destination: destination || items[0]?.destination || 'Sin definir'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.addItem = (req, res) => {
  try {
    const { codigo, category, weight, destination } = req.body;
    if (!codigo || !category || weight === undefined) {
      return res.status(400).json({ success: false, error: 'Datos incompletos', message: 'Se requiere codigo, category y weight.' });
    }

    const result = db.prepare(`
      INSERT INTO consolidacion_items (codigo, category, weight, destination)
      VALUES (?, ?, ?, ?)
    `).run(codigo, category, weight, destination || 'Despensa Centro');

    const newItem = db.prepare('SELECT * FROM consolidacion_items WHERE id = ?').get(result.lastInsertRowid);

    // Get updated totals
    const allItems = db.prepare('SELECT * FROM consolidacion_items').all();
    const totalWeight = allItems.reduce((sum, item) => sum + item.weight, 0);

    res.status(201).json({
      success: true,
      data: newItem,
      total_items: allItems.length,
      total_weight: totalWeight,
      message: 'Ítem agregado a la consolidación.'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};

exports.clear = (req, res) => {
  try {
    const count = db.prepare('SELECT COUNT(*) as count FROM consolidacion_items').get();
    db.prepare('DELETE FROM consolidacion_items').run();
    res.json({ success: true, message: `Consolidación limpiada. Se eliminaron ${count.count} ítems.` });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
  }
};
