const express = require('express');
const router = express.Router();
const controller = require('../controllers/donaciones.controller');

/**
 * @swagger
 * /api/donaciones:
 *   get:
 *     summary: Listar donaciones
 *     description: Obtiene la lista de donaciones registradas. Permite filtrar por estado, categoría, donante o búsqueda general.
 *     tags: [Donaciones]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Aprobado, Retenido, Pendiente Clasificación]
 *         description: Filtrar por estado de la donación
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoría (Abarrotes, Perecederos, Mixto, etc.)
 *       - in: query
 *         name: donante_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID del donante
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda por nombre de donante, código o categoría
 *     responses:
 *       200:
 *         description: Lista de donaciones obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   codigo: DON-8492
 *                   donante_id: 1
 *                   donor_name: Supermercados La Granja
 *                   category: Abarrotes
 *                   weight: 250
 *                   batch_number: L-48290
 *                   expiration_date: "2026-08-20"
 *                   temperature: 20
 *                   vehicle_status: Óptimo
 *                   notes: "Llegada a tiempo. Cajas en perfecto estado."
 *                   status: Aprobado
 *                   issue_details: null
 *                   timestamp: "10:45 AM"
 *               total: 1
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/donaciones/{id}:
 *   get:
 *     summary: Obtener donación por ID
 *     description: Obtiene los datos completos de una donación específica.
 *     tags: [Donaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Donación encontrada
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 codigo: DON-8492
 *                 donor_name: Supermercados La Granja
 *                 category: Abarrotes
 *                 weight: 250
 *                 status: Aprobado
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Donación no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/donaciones:
 *   post:
 *     summary: Registrar nueva donación
 *     description: |
 *       Registra una nueva entrada de donación. Genera automáticamente:
 *       - Un código único (DON-XXXX)
 *       - Un timestamp con la hora actual
 *       - Un lote asociado en el tablero Kanban
 *       - Determinación automática del estado si no se proporciona (basado en temperatura y categoría)
 *     tags: [Donaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DonacionInput'
 *           examples:
 *             abarrotes:
 *               summary: Donación de abarrotes (no perecederos)
 *               value:
 *                 donante_id: 1
 *                 donor_name: Supermercados Cuitlahuac
 *                 category: Abarrotes
 *                 weight: 150.5
 *                 batch_number: L-48295
 *                 expiration_date: "2026-09-15"
 *                 temperature: 18
 *                 vehicle_status: Óptimo
 *                 notes: "Mercancía en buen estado, cajas selladas."
 *             perecederos:
 *               summary: Donación de perecederos (temperatura alta → Retenido)
 *               value:
 *                 donante_id: 2
 *                 donor_name: Productora Agrícola Sur
 *                 category: Lácteos y Frío
 *                 weight: 80
 *                 batch_number: L-48300
 *                 expiration_date: "2026-06-30"
 *                 temperature: 8
 *                 vehicle_status: Regular
 *                 notes: "Temperatura al límite de control"
 *     responses:
 *       201:
 *         description: Donación registrada exitosamente con lote asociado
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 4
 *                 codigo: DON-5273
 *                 donor_name: Supermercados Cuitlahuac
 *                 category: Abarrotes
 *                 weight: 150.5
 *                 status: Aprobado
 *                 timestamp: "14:30"
 *               lote_creado: LOTE-9542
 *               message: "Donación registrada correctamente. Se creó un lote asociado."
 *       400:
 *         description: Datos incompletos
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: Datos incompletos
 *               message: Se requiere donor_name, category y weight.
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       409:
 *         description: Código duplicado
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: Conflicto
 *               message: Ya existe una donación con ese código.
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.post('/', controller.create);

/**
 * @swagger
 * /api/donaciones/{id}:
 *   put:
 *     summary: Actualizar donación
 *     description: Actualiza los datos de una donación existente.
 *     tags: [Donaciones]
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
 *           example:
 *             weight: 275
 *             notes: "Se verificó peso adicional en segunda revisión."
 *             status: Aprobado
 *     responses:
 *       200:
 *         description: Donación actualizada
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 codigo: DON-8492
 *                 weight: 275
 *                 notes: "Se verificó peso adicional en segunda revisión."
 *                 status: Aprobado
 *               message: Donación actualizada correctamente.
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Donación no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.put('/:id', controller.update);

/**
 * @swagger
 * /api/donaciones/{id}/status:
 *   patch:
 *     summary: Cambiar estado de donación
 *     description: Actualiza únicamente el estado de una donación (Aprobado, Retenido, Pendiente Clasificación).
 *     tags: [Donaciones]
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
 *           schema:
 *             $ref: '#/components/schemas/DonacionStatusUpdate'
 *           example:
 *             status: Aprobado
 *             issue_details: "Aprobado tras inspección de calidad exitosa"
 *     responses:
 *       200:
 *         description: Estado actualizado
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 2
 *                 codigo: DON-8493
 *                 status: Aprobado
 *                 issue_details: "Aprobado tras inspección de calidad exitosa"
 *               message: "Estado de donación actualizado a: Aprobado"
 *       400:
 *         description: Datos incompletos
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Donación no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.patch('/:id/status', controller.updateStatus);

/**
 * @swagger
 * /api/donaciones/{id}:
 *   delete:
 *     summary: Eliminar donación
 *     description: Elimina una donación del sistema de forma permanente.
 *     tags: [Donaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *     responses:
 *       200:
 *         description: Donación eliminada
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Donación eliminada correctamente.
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Donación no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.delete('/:id', controller.delete);

module.exports = router;
