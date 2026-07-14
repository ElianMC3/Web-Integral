const express = require('express');
const router = express.Router();
const controller = require('../controllers/lotes.controller');

/**
 * @swagger
 * /api/lotes:
 *   get:
 *     summary: Listar lotes (tareas Kanban)
 *     description: Obtiene la lista de lotes del tablero operativo. Permite filtrar por columna, estado o búsqueda.
 *     tags: [Lotes]
 *     parameters:
 *       - in: query
 *         name: columna
 *         schema:
 *           type: string
 *           enum: [PENDIENTE, EN_PROCESO, CONTROL_CALIDAD]
 *         description: Filtrar por columna del Kanban
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Frío, Asignado, Sin asignar, Esperando Inspector]
 *         description: Filtrar por estado del lote
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda por título, código o donante
 *     responses:
 *       200:
 *         description: Lista de lotes obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   codigo: LOTE-9921
 *                   title: Lácteos Mixtos
 *                   donor: Supermercado A
 *                   weight: "150kg"
 *                   due_date: "Hoy 14:00"
 *                   status: Frío
 *                   columna: PENDIENTE
 *                   progress: 0
 *                   location: null
 *                   assigned_to: null
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
 * /api/lotes/{id}:
 *   get:
 *     summary: Obtener lote por ID
 *     description: Obtiene los datos completos de un lote específico.
 *     tags: [Lotes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lote encontrado
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Lote no encontrado
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
 * /api/lotes:
 *   post:
 *     summary: Crear nuevo lote
 *     description: Crea una nueva tarea de lote en el tablero operativo. Genera automáticamente un código LOTE-XXXX.
 *     tags: [Lotes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoteInput'
 *           example:
 *             title: Clasificación Lote Frutas
 *             donor: Productor Local
 *             weight: "300kg"
 *             due_date: "Hoy 18:00"
 *             status: Sin asignar
 *             columna: PENDIENTE
 *     responses:
 *       201:
 *         description: Lote creado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 5
 *                 codigo: LOTE-9543
 *                 title: Clasificación Lote Frutas
 *                 donor: Productor Local
 *                 weight: "300kg"
 *                 columna: PENDIENTE
 *               message: Lote creado correctamente.
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
 * /api/lotes/{id}:
 *   put:
 *     summary: Actualizar lote
 *     description: Actualiza los datos de un lote existente.
 *     tags: [Lotes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             progress: 80
 *             assigned_to: "María L."
 *             location: "Mesa 2"
 *     responses:
 *       200:
 *         description: Lote actualizado
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 3
 *                 codigo: LOTE-9915
 *                 progress: 80
 *                 assigned_to: "María L."
 *                 location: "Mesa 2"
 *               message: Lote actualizado correctamente.
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Lote no encontrado
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
 * /api/lotes/{id}/mover:
 *   patch:
 *     summary: Mover lote entre columnas del Kanban
 *     description: |
 *       Mueve un lote a una columna diferente del tablero operativo.
 *
 *       **Lógica automática:**
 *       - Al mover a `EN_PROCESO`: se asigna progreso inicial (10%), ubicación aleatoria y responsable
 *       - Al mover a `CONTROL_CALIDAD`: el status cambia a "Esperando Inspector"
 *     tags: [Lotes]
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
 *             $ref: '#/components/schemas/LoteMover'
 *           example:
 *             columna: EN_PROCESO
 *     responses:
 *       200:
 *         description: Lote movido exitosamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 codigo: LOTE-9921
 *                 columna: EN_PROCESO
 *                 progress: 10
 *                 location: "Mesa 3"
 *                 assigned_to: "Carlos D."
 *               message: "Lote movido a columna: EN_PROCESO"
 *       400:
 *         description: Datos incompletos
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Lote no encontrado
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
router.patch('/:id/mover', controller.mover);

/**
 * @swagger
 * /api/lotes/{id}:
 *   delete:
 *     summary: Eliminar lote
 *     description: Elimina un lote del tablero operativo.
 *     tags: [Lotes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 4
 *     responses:
 *       200:
 *         description: Lote eliminado
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Lote eliminado correctamente.
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Lote no encontrado
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
