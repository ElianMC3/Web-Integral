const express = require('express');
const router = express.Router();
const controller = require('../controllers/incidencias.controller');

/**
 * @swagger
 * /api/incidencias:
 *   get:
 *     summary: Listar incidencias logísticas
 *     description: Obtiene las incidencias de transporte. Permite filtrar por estado (active/reviewed).
 *     tags: [Incidencias]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, reviewed]
 *         description: Filtrar por estado de la incidencia
 *     responses:
 *       200:
 *         description: Lista de incidencias
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   codigo: INC-01
 *                   title: "Desvío de Ruta (TR-02)"
 *                   unit: TR-02
 *                   status: active
 *                 - id: 2
 *                   codigo: INC-02
 *                   title: "Retraso Tráfico (CV-01)"
 *                   unit: CV-01
 *                   status: active
 *               total: 2
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
 * /api/incidencias/{id}:
 *   get:
 *     summary: Obtener incidencia por ID
 *     description: Obtiene los datos de una incidencia específica.
 *     tags: [Incidencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Incidencia encontrada
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Incidencia no encontrada
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
 * /api/incidencias:
 *   post:
 *     summary: Crear nueva incidencia
 *     description: Registra una nueva incidencia de transporte con estado inicial "active".
 *     tags: [Incidencias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IncidenciaInput'
 *           example:
 *             title: "Fallo mecánico en unidad TR-03"
 *             unit: TR-03
 *     responses:
 *       201:
 *         description: Incidencia creada
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 3
 *                 codigo: INC-03
 *                 title: "Fallo mecánico en unidad TR-03"
 *                 unit: TR-03
 *                 status: active
 *               message: Incidencia registrada correctamente.
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

/**
 * @swagger
 * /api/incidencias/{id}/resolver:
 *   patch:
 *     summary: Resolver incidencia
 *     description: Marca una incidencia como revisada/resuelta. Cambia su estado de "active" a "reviewed".
 *     tags: [Incidencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Incidencia resuelta
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 codigo: INC-01
 *                 title: "Desvío de Ruta (TR-02)"
 *                 status: reviewed
 *               message: Incidencia revisada y resuelta correctamente.
 *       400:
 *         description: Incidencia ya resuelta
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Incidencia no encontrada
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
router.patch('/:id/resolver', controller.resolver);

module.exports = router;
