const express = require('express');
const router = express.Router();
const controller = require('../controllers/unidades.controller');

/**
 * @swagger
 * /api/unidades:
 *   get:
 *     summary: Listar unidades logísticas
 *     description: Obtiene la lista de unidades de transporte. Permite filtrar por tipo o búsqueda.
 *     tags: [Unidades]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Refrigerado, Seco]
 *         description: Filtrar por tipo de unidad
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda por conductor o código
 *     responses:
 *       200:
 *         description: Lista de unidades obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   codigo: TR-01
 *                   driver: Miguel Ángel
 *                   type: Refrigerado
 *                   capacity: "12T"
 *                   load_percentage: 85
 *                   temp: "-18°C"
 *                   eta: "14:30"
 *                   status_badge: null
 *                   location: null
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
 * /api/unidades/{id}:
 *   get:
 *     summary: Obtener unidad por ID
 *     description: Obtiene los datos completos de una unidad logística.
 *     tags: [Unidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Unidad encontrada
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Unidad no encontrada
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
 * /api/unidades:
 *   post:
 *     summary: Crear nueva unidad logística
 *     description: Registra una nueva unidad de transporte. El código se genera automáticamente (TR-XX para refrigerados, CV-XX para secos) si no se proporciona.
 *     tags: [Unidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UnidadInput'
 *           example:
 *             driver: José Hernández
 *             type: Refrigerado
 *             capacity: "10T"
 *             load_percentage: 0
 *             temp: "-20°C"
 *             location: Andén 3
 *     responses:
 *       201:
 *         description: Unidad creada exitosamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 3
 *                 codigo: TR-05
 *                 driver: José Hernández
 *                 type: Refrigerado
 *                 capacity: "10T"
 *               message: Unidad creada correctamente.
 *       400:
 *         description: Datos incompletos
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       409:
 *         description: Código duplicado
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
 * /api/unidades/{id}:
 *   put:
 *     summary: Actualizar unidad logística
 *     description: Actualiza los datos de una unidad de transporte existente.
 *     tags: [Unidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             load_percentage: 75
 *             status_badge: "EN RUTA"
 *             location: "Zona Sur"
 *             eta: "15:45"
 *     responses:
 *       200:
 *         description: Unidad actualizada
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Unidad no encontrada
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
router.put('/:id', controller.update);

/**
 * @swagger
 * /api/unidades/{id}:
 *   delete:
 *     summary: Eliminar unidad logística
 *     description: Elimina una unidad de transporte del sistema.
 *     tags: [Unidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     responses:
 *       200:
 *         description: Unidad eliminada
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Unidad no encontrada
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
router.delete('/:id', controller.delete);

module.exports = router;
