const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || './data/seda.db';
const dbDir = path.dirname(path.resolve(DB_PATH));

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(path.resolve(DB_PATH));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ──────────────────────────────────────────────────────────────────────────────
// Schema creation
// ──────────────────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nombre TEXT NOT NULL,
    office TEXT DEFAULT 'Despensa Norte',
    avatar TEXT,
    role TEXT DEFAULT 'operador' CHECK(role IN ('admin', 'operador', 'supervisor', 'conductor')),
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS donantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    empresa TEXT,
    rfc TEXT,
    telefono TEXT,
    email TEXT,
    direccion TEXT,
    categoria TEXT DEFAULT 'Categoría A',
    tipo TEXT DEFAULT 'Recurrente' CHECK(tipo IN ('Recurrente', 'Eventual', 'Corporativo', 'Institucional')),
    notas TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS donaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT UNIQUE NOT NULL,
    donante_id INTEGER,
    donor_name TEXT NOT NULL,
    category TEXT NOT NULL,
    weight REAL NOT NULL DEFAULT 0,
    batch_number TEXT,
    expiration_date TEXT,
    temperature REAL,
    vehicle_status TEXT DEFAULT 'Óptimo' CHECK(vehicle_status IN ('Óptimo', 'Regular', 'Deficiente')),
    notes TEXT,
    evidence_name TEXT,
    signature_data TEXT,
    status TEXT DEFAULT 'Pendiente Clasificación' CHECK(status IN ('Aprobado', 'Retenido', 'Pendiente Clasificación')),
    issue_details TEXT,
    timestamp TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (donante_id) REFERENCES donantes(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS lotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    donor TEXT,
    weight TEXT,
    due_date TEXT,
    status TEXT DEFAULT 'Sin asignar' CHECK(status IN ('Frío', 'Asignado', 'Sin asignar', 'Esperando Inspector')),
    columna TEXT DEFAULT 'PENDIENTE' CHECK(columna IN ('PENDIENTE', 'EN_PROCESO', 'CONTROL_CALIDAD')),
    progress INTEGER DEFAULT 0,
    location TEXT,
    assigned_to TEXT,
    donacion_id INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (donacion_id) REFERENCES donaciones(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS unidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT UNIQUE NOT NULL,
    driver TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('Refrigerado', 'Seco')),
    capacity TEXT NOT NULL,
    load_percentage INTEGER DEFAULT 0,
    temp TEXT,
    eta TEXT,
    status_badge TEXT,
    location TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS incidencias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    unit TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'reviewed')),
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS historial_rutas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT UNIQUE NOT NULL,
    driver TEXT NOT NULL,
    unit TEXT NOT NULL,
    action_text TEXT NOT NULL,
    lote TEXT,
    details TEXT,
    time TEXT,
    date TEXT,
    status_badge TEXT,
    status_color TEXT,
    extra_badge TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS alertas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('caducidad', 'incidencia')),
    title TEXT NOT NULL,
    level TEXT NOT NULL CHECK(level IN ('URGENTE', 'RETRASO')),
    description TEXT,
    details TEXT,
    resolved INTEGER DEFAULT 0,
    contact_name TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS consolidacion_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT NOT NULL,
    category TEXT NOT NULL,
    weight REAL NOT NULL DEFAULT 0,
    destination TEXT DEFAULT 'Despensa Centro',
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

module.exports = db;
