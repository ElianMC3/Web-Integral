const express = require('express');
const router = express.Router();
const controller = require('../controllers/donantes.controller');

/**
 * @swagger
 * /api/donantes:
 *   get:
 *     summary: Listar donantes
 *     description: Obtiene la lista de donantes registrados. Permite filtrar por tipo, categoría o búsqueda general.
 *     tags: [Donantes]
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [Recurrente, Eventual, Corporativo, Institucional]
 *         description: Filtrar por tipo de donante
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar por categoría (ej. Categoría A)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda por nombre, empresa o RFC
 *     responses:
 *       200:
 *         description: Lista de donantes obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   nombre: Supermercados La Granja
 *                   empresa: Supermercados La Granja S.A. de C.V.
 *                   rfc: SLG990101ABC
 *                   telefono: "55 4821 3390"
 *                   email: contacto@lagranja.com
 *                   direccion: "Av. Central 456, Col. Centro"
 *                   categoria: Categoría A
 *                   tipo: Recurrente
 *                   notas: "Donante frecuente, entregas los lunes y viernes"
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
 * /api/donantes/{id}:
 *   get:
 *     summary: Obtener donante por ID
 *     description: Obtiene los datos completos de un donante específico.
 *     tags: [Donantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del donante
 *         example: 1
 *     responses:
 *       200:
 *         description: Donante encontrado
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 nombre: Supermercados La Granja
 *                 empresa: Supermercados La Granja S.A. de C.V.
 *                 rfc: SLG990101ABC
 *                 telefono: "55 4821 3390"
 *                 email: contacto@lagranja.com
 *                 direccion: "Av. Central 456, Col. Centro"
 *                 categoria: Categoría A
 *                 tipo: Recurrente
 *                 notas: "Donante frecuente"
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Donante no encontrado
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
 * /api/donantes:
 *   post:
 *     summary: Crear nuevo donante
 *     description: Registra un nuevo donante en el sistema. El campo nombre es obligatorio.
 *     tags: [Donantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DonanteInput'
 *           example:
 *             nombre: Juan Pérez García
 *             empresa: Supermercados XYZ
 *             rfc: XAXX010101000
 *             telefono: "55 1234 5678"
 *             email: donante@empresa.com
 *             direccion: "Calle Principal 123, Col. Centro"
 *             categoria: Categoría A
 *             tipo: Recurrente
 *             notas: "Días disponibles: Lunes a Viernes"
 *     responses:
 *       201:
 *         description: Donante creado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 5
 *                 nombre: Juan Pérez García
 *                 empresa: Supermercados XYZ
 *                 rfc: XAXX010101000
 *                 telefono: "55 1234 5678"
 *                 email: donante@empresa.com
 *                 direccion: "Calle Principal 123, Col. Centro"
 *                 categoria: Categoría A
 *                 tipo: Recurrente
 *                 notas: "Días disponibles: Lunes a Viernes"
 *               message: Donante registrado correctamente.
 *       400:
 *         description: Datos incompletos
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: Datos incompletos
 *               message: El campo nombre es requerido.
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
router.post('/', controller.create);

/**
 * @swagger
 * /api/donantes/{id}:
 *   put:
 *     summary: Actualizar donante
 *     description: Actualiza los datos de un donante existente. Solo se actualizan los campos proporcionados.
 *     tags: [Donantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del donante
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: Supermercados La Granja Actualizado
 *             telefono: "55 9999 8888"
 *             notas: "Ahora entrega también los miércoles"
 *     responses:
 *       200:
 *         description: Donante actualizado correctamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 nombre: Supermercados La Granja Actualizado
 *                 telefono: "55 9999 8888"
 *                 notas: "Ahora entrega también los miércoles"
 *               message: Donante actualizado correctamente.
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Donante no encontrado
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
 * /api/donantes/{id}:
 *   delete:
 *     summary: Eliminar donante
 *     description: Elimina un donante del sistema. Las donaciones asociadas mantendrán su referencia como NULL.
 *     tags: [Donantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del donante a eliminar
 *         example: 3
 *     responses:
 *       200:
 *         description: Donante eliminado
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Donante eliminado correctamente.
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Donante no encontrado
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
