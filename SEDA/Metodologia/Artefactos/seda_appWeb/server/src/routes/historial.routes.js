const express = require('express');
const router = express.Router();
const controller = require('../controllers/historial.controller');

/**
 * @swagger
 * /api/historial-rutas:
 *   get:
 *     summary: Consultar historial de rutas
 *     description: Obtiene el registro histórico de entregas y auditoría de rutas. Permite buscar por conductor, lote, destino o estado.
 *     tags: [Historial de Rutas]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda por conductor, lote, detalles o estado
 *         example: Miguel
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Filtrar por fecha (formato dd/mm/yyyy)
 *         example: "11/05/2026"
 *     responses:
 *       200:
 *         description: Historial obtenido exitosamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   codigo: HIST-01
 *                   driver: "Miguel Ángel (TR-01)"
 *                   unit: TR-01
 *                   action_text: "completó la entrega del"
 *                   lote: LOTE-9918
 *                   details: "Destino: Zona Sur (Despensas comunitarias, Sector 2) • Tipo: Perecederos"
 *                   time: "14:30 PM"
 *                   date: "11/05/2026"
 *                   status_badge: Entrega Exitosa
 *                   status_color: "bg-emerald-100 text-emerald-800 border-emerald-200"
 *                   extra_badge: "Temp Final: -17.8°C"
 *               total: 1
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/historial-rutas/{id}:
 *   get:
 *     summary: Obtener registro histórico por ID
 *     description: Obtiene un registro específico del historial de rutas.
 *     tags: [Historial de Rutas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Registro encontrado
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Registro no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/historial-rutas:
 *   post:
 *     summary: Crear registro histórico
 *     description: Crea un nuevo registro en el historial de rutas. Se generan automáticamente el código, hora y fecha si no se proporcionan.
 *     tags: [Historial de Rutas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HistorialRutaInput'
 *           example:
 *             driver: "Roberto P. (CV-04)"
 *             unit: CV-04
 *             action_text: "completó la entrega del"
 *             lote: LOTE-9920
 *             details: "Destino: Comedor Comunitario Esperanza • Tipo: Secos"
 *             status_badge: Entrega Exitosa
 *             status_color: "bg-emerald-100 text-emerald-800 border-emerald-200"
 *     responses:
 *       201:
 *         description: Registro creado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 4
 *                 codigo: HIST-54321
 *                 driver: "Roberto P. (CV-04)"
 *                 unit: CV-04
 *                 action_text: "completó la entrega del"
 *                 lote: LOTE-9920
 *                 status_badge: Entrega Exitosa
 *               message: Registro histórico creado correctamente.
 *       400:
 *         description: Datos incompletos
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.post('/', controller.create);

module.exports = router;
