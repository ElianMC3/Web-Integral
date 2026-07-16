const express = require('express');
const router = express.Router();
const controller = require('../controllers/alertas.controller');

/**
 * @swagger
 * /api/alertas:
 *   get:
 *     summary: Listar alertas operativas
 *     description: Obtiene las alertas operativas del sistema. Permite filtrar por tipo, nivel de urgencia o estado de resolución.
 *     tags: [Alertas]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [caducidad, incidencia]
 *         description: Filtrar por tipo de alerta
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [URGENTE, RETRASO]
 *         description: Filtrar por nivel de urgencia
 *       - in: query
 *         name: resolved
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: Filtrar por estado de resolución
 *     responses:
 *       200:
 *         description: Lista de alertas obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   codigo: ALERT-01
 *                   type: caducidad
 *                   title: "Caducidad Próxima (Lácteos)"
 *                   level: URGENTE
 *                   description: "DON L-4592 (150kg) caduca en 48h."
 *                   details: "Ubicación: Cámara Frío 2, Pasillo B."
 *                   resolved: false
 *                   contact_name: null
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
 * /api/alertas/{id}:
 *   get:
 *     summary: Obtener alerta por ID
 *     description: Obtiene los datos de una alerta operativa específica.
 *     tags: [Alertas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Alerta encontrada
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Alerta no encontrada
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
 * /api/alertas:
 *   post:
 *     summary: Crear nueva alerta operativa
 *     description: Registra una nueva alerta operativa con estado inicial no resuelto.
 *     tags: [Alertas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlertaInput'
 *           example:
 *             type: caducidad
 *             title: "Caducidad Próxima (Carnes)"
 *             level: URGENTE
 *             description: "Lote de carnes C-1020 (80kg) caduca en 24h."
 *             details: "Ubicación: Cámara Frío 1, Pasillo A."
 *     responses:
 *       201:
 *         description: Alerta creada
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
 * /api/alertas/{id}/resolver:
 *   patch:
 *     summary: Resolver alerta operativa
 *     description: |
 *       Marca una alerta como resuelta con la acción tomada.
 *       Automáticamente crea un registro en el historial de rutas documentando la resolución.
 *     tags: [Alertas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlertaResolver'
 *           examples:
 *             ruta_rapida:
 *               summary: Asignar a ruta rápida
 *               value:
 *                 action: Asignado a ruta rápida
 *             reenrutar:
 *               summary: Re-enrutar vehículo
 *               value:
 *                 action: Re-enrutado
 *             descartar:
 *               summary: Descartar por caducidad
 *               value:
 *                 action: Descartado por caducidad
 *     responses:
 *       200:
 *         description: Alerta resuelta exitosamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 codigo: ALERT-01
 *                 title: "Caducidad Próxima (Lácteos)"
 *                 resolved: true
 *               historial_creado: HIST-54321
 *               message: "Alerta resuelta con acción: Asignado a ruta rápida"
 *       400:
 *         description: Alerta ya resuelta o datos incompletos
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Alerta no encontrada
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
