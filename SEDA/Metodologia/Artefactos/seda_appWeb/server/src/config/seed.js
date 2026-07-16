/**
 * Seed script — Populates the database with initial data matching
 * the hardcoded data from the frontend useStore.ts
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./database');

console.log('🌱 Seeding SEDA database...\n');

// ── Usuarios ──
const passwordHash = bcrypt.hashSync('admin123', 10);
const operadorHash = bcrypt.hashSync('operador123', 10);
const supervisorHash = bcrypt.hashSync('supervisor123', 10);
const conductorHash = bcrypt.hashSync('conductor123', 10);

const insertUser = db.prepare(`
  INSERT OR IGNORE INTO usuarios (email, password, nombre, office, role)
  VALUES (?, ?, ?, ?, ?)
`);

insertUser.run('admin@seda.org', passwordHash, 'Carlos Dispatcher', 'Despensa Norte', 'admin');
insertUser.run('operador@seda.org', operadorHash, 'Ana Martínez', 'Despensa Centro', 'operador');
insertUser.run('supervisor@seda.org', supervisorHash, 'Roberto Pérez', 'Despensa Sur', 'supervisor');
insertUser.run('conductor@seda.org', conductorHash, 'Miguel Ángel', 'Flota Transporte', 'conductor');

console.log(' Usuarios creados (4)');

// ── Donantes ──
const insertDonante = db.prepare(`
  INSERT OR IGNORE INTO donantes (nombre, empresa, rfc, telefono, email, direccion, categoria, tipo, notas)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertDonante.run('Supermercados La Granja', 'Supermercados La Granja S.A. de C.V.', 'SLG990101ABC', '55 4821 3390', 'contacto@lagranja.com', 'Av. Central 456, Col. Centro', 'Categoría A', 'Recurrente', 'Donante frecuente, entregas los lunes y viernes');
insertDonante.run('Productora Agrícola Sur', 'Productora Agrícola del Sur S.A.', 'PAS850315DEF', '55 7712 4480', 'ventas@agricolasur.com', 'Carretera Sur Km 15', 'Categoría A', 'Recurrente', 'Frutas y verduras de temporada');
insertDonante.run('Donante Particular', null, null, '55 2233 4455', 'particular@email.com', 'Col. Las Flores 789', 'Categoría B', 'Eventual', 'Donación mixta ocasional');
insertDonante.run('Supermercados Cuitlahuac', 'Cadena Cuitlahuac S.A. de C.V.', 'CCU070101GHI', '55 9988 7766', 'donaciones@cuitlahuac.com', 'Blvd. Norte 1200', 'Categoría A', 'Corporativo', 'Donante corporativo principal');

console.log(' Donantes creados (4)');

// ── Donaciones ──
const insertDonacion = db.prepare(`
  INSERT OR IGNORE INTO donaciones (codigo, donante_id, donor_name, category, weight, batch_number, expiration_date, temperature, vehicle_status, notes, status, issue_details, timestamp)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertDonacion.run('DON-8492', 1, 'Supermercados La Granja', 'Abarrotes', 250, 'L-48290', '2026-08-20', 20, 'Óptimo', 'Llegada a tiempo. Cajas en perfecto estado.', 'Aprobado', null, '10:45 AM');
insertDonacion.run('DON-8493', 2, 'Productora Agrícola Sur', 'Perecederos', 120, 'L-48291', '2026-06-25', 8, 'Óptimo', 'Temperatura de llegada al límite de control.', 'Retenido', 'Temperatura de llegada límite (8°C). Requiere inspección de calidad.', '11:15 AM');
insertDonacion.run('DON-8494', 3, 'Donante Particular', 'Mixto', 45, 'L-48292', '2026-07-10', 18, 'Regular', 'Donación mixta menor de alimentos secos y algunas frutas.', 'Pendiente Clasificación', null, '11:50 AM');

console.log(' Donaciones creadas (3)');

// ── Lotes (Kanban Tasks) ──
const insertLote = db.prepare(`
  INSERT OR IGNORE INTO lotes (codigo, title, donor, weight, due_date, status, columna, progress, location, assigned_to)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertLote.run('LOTE-9921', 'Lácteos Mixtos', 'Supermercado A', '150kg', 'Hoy 14:00', 'Frío', 'PENDIENTE', 0, null, null);
insertLote.run('LOTE-9922', 'Abarrotes Generales', 'Mayorista Sur', '500kg', 'Mañana', 'Sin asignar', 'PENDIENTE', 0, null, null);
insertLote.run('LOTE-9915', 'Verduras Mixtas', 'Productor Local', '300kg', 'Hoy 18:00', 'Asignado', 'EN_PROCESO', 60, 'Mesa 4', 'Carlos D.');
insertLote.run('LOTE-9908', 'Cajas Despensa Familiar', 'Despensa Sur', '50 Cajas', 'Esperando Inspector', 'Esperando Inspector', 'CONTROL_CALIDAD', 0, null, null);

console.log(' Lotes creados (4)');

// ── Unidades Logísticas ──
const insertUnidad = db.prepare(`
  INSERT OR IGNORE INTO unidades (codigo, driver, type, capacity, load_percentage, temp, eta, status_badge, location)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertUnidad.run('TR-01', 'Miguel Ángel', 'Refrigerado', '12T', 85, '-18°C', '14:30', null, null);
insertUnidad.run('CV-04', 'Roberto P.', 'Seco', '8T', 40, null, null, 'CARGA EN PROCESO', 'Andén 2');

console.log(' Unidades creadas (2)');

// ── Incidencias ──
const insertIncidencia = db.prepare(`
  INSERT OR IGNORE INTO incidencias (codigo, title, unit, status)
  VALUES (?, ?, ?, ?)
`);

insertIncidencia.run('INC-01', 'Desvío de Ruta (TR-02)', 'TR-02', 'active');
insertIncidencia.run('INC-02', 'Retraso Tráfico (CV-01)', 'CV-01', 'active');

console.log(' Incidencias creadas (2)');

// ── Historial de Rutas ──
const insertHistorial = db.prepare(`
  INSERT OR IGNORE INTO historial_rutas (codigo, driver, unit, action_text, lote, details, time, date, status_badge, status_color, extra_badge)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertHistorial.run('HIST-01', 'Miguel Ángel (TR-01)', 'TR-01', 'completó la entrega del', 'LOTE-9918', 'Destino: Zona Sur (Despensas comunitarias, Sector 2) • Tipo: Perecederos', '14:30 PM', '11/05/2026', 'Entrega Exitosa', 'bg-emerald-100 text-emerald-800 border-emerald-200', 'Temp Final: -17.8°C');
insertHistorial.run('HIST-02', 'Sistema', 'SYSTEM', 'reasignó la ruta para', 'LOTE-9919', 'Motivo: Retraso por tráfico reportado en Ruta Principal Norte.', '10:15 AM', '11/05/2026', 'Desvío Autorizado', 'bg-amber-100 text-amber-800 border-amber-200', null);
insertHistorial.run('HIST-03', 'Roberto P. (CV-04)', 'CV-04', 'completó la entrega del', 'LOTE-9915', 'Destino: Comedor Comunitario Esperanza • Tipo: Secos', '16:45 PM', '10/05/2026', 'Entrega Exitosa', 'bg-emerald-100 text-emerald-800 border-emerald-200', null);

console.log(' Historial de rutas creado (3)');

// ── Alertas Operativas ──
const insertAlerta = db.prepare(`
  INSERT OR IGNORE INTO alertas (codigo, type, title, level, description, details, resolved, contact_name)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

insertAlerta.run('ALERT-01', 'caducidad', 'Caducidad Próxima (Lácteos)', 'URGENTE', 'DON L-4592 (150kg) caduca en 48h.', 'Ubicación: Cámara Frío 2, Pasillo B.', 0, null);
insertAlerta.run('ALERT-02', 'incidencia', 'Incidencia en Ruta Norte-04', 'RETRASO', 'Tráfico pesado reportado. Retraso estimado de 45 min en recolección de Donante D-12.', 'Acción sugerida: Re-rutar vehículo.', 0, 'Roberto P. (CV-04)');

console.log(' Alertas creadas (2)');

// ── Consolidación ──
const insertConsolidacion = db.prepare(`
  INSERT OR IGNORE INTO consolidacion_items (codigo, category, weight, destination)
  VALUES (?, ?, ?, ?)
`);

insertConsolidacion.run('LOTE-9901', 'No Perecederos', 50, 'Despensa Centro');
insertConsolidacion.run('LOTE-9905', 'Perecederos', 50, 'Despensa Centro');

console.log(' Ítems de consolidación creados (2)');

console.log('\n🎉 Seed completado exitosamente.');
console.log('\n📋 Credenciales de acceso:');
console.log('   admin@seda.org / admin123 (admin)');
console.log('   operador@seda.org / operador123 (operador)');
console.log('   supervisor@seda.org / supervisor123 (supervisor)');
console.log('   conductor@seda.org / conductor123 (conductor)');

db.close();
