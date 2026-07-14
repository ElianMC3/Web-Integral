const db = require('../config/database');

exports.getAll = (req, res) => {
  try {
    const users = db.prepare('SELECT id, email, nombre, office, avatar, role, created_at FROM usuarios').all();
    res.json({ success: true, data: users, total: users.length });
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
