const express = require('express');
const router = express.Router();
const controller = require('../controllers/consolidacion.controller');

/**
 * @swagger
 * /api/consolidacion:
 *   get:
 *     summary: Obtener estado de consolidación
 *     description: Obtiene todos los ítems de la consolidación actual, incluyendo el peso total y el destino.
 *     tags: [Consolidación]
 *     parameters:
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *         description: Filtrar por destino/despensa
 *         example: Despensa Centro
 *     responses:
 *       200:
 *         description: Estado de consolidación obtenido
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   codigo: LOTE-9901
 *                   category: No Perecederos
 *                   weight: 50
 *                   destination: Despensa Centro
 *                 - id: 2
 *                   codigo: LOTE-9905
 *                   category: Perecederos
 *                   weight: 50
 *                   destination: Despensa Centro
 *               total: 2
 *               total_weight: 100
 *               destination: Despensa Centro
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
 * /api/consolidacion/items:
 *   post:
 *     summary: Agregar ítem a consolidación
 *     description: Agrega un lote al bulto de consolidación actual. Simula el escaneo de código de barras del módulo de empacado.
 *     tags: [Consolidación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConsolidacionItemInput'
 *           example:
 *             codigo: LOTE-9910
 *             category: Perecederos
 *             weight: 75
 *             destination: Despensa Norte
 *     responses:
 *       201:
 *         description: Ítem agregado a la consolidación
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 3
 *                 codigo: LOTE-9910
 *                 category: Perecederos
 *                 weight: 75
 *                 destination: Despensa Norte
 *               total_items: 3
 *               total_weight: 175
 *               message: Ítem agregado a la consolidación.
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
router.post('/items', controller.addItem);

/**
 * @swagger
 * /api/consolidacion:
 *   delete:
 *     summary: Limpiar consolidación
 *     description: Elimina todos los ítems de la consolidación actual. Equivale a limpiar el bulto antes de iniciar uno nuevo.
 *     tags: [Consolidación]
 *     responses:
 *       200:
 *         description: Consolidación limpiada
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Consolidación limpiada. Se eliminaron 3 ítems."
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
router.delete('/', controller.clear);

module.exports = router;
