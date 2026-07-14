const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios.controller');

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Listar todos los usuarios
 *     description: Obtiene la lista completa de usuarios registrados en el sistema. No incluye contraseñas en la respuesta.
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   email: admin@seda.org
 *                   nombre: Carlos Dispatcher
 *                   office: Despensa Norte
 *                   avatar: null
 *                   role: admin
 *                   created_at: "2026-05-11 10:00:00"
 *                 - id: 2
 *                   email: operador@seda.org
 *                   nombre: Ana Martínez
 *                   office: Despensa Centro
 *                   avatar: null
 *                   role: operador
 *                   created_at: "2026-05-11 10:00:00"
 *               total: 2
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
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     description: Obtiene los datos de un usuario específico por su ID.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 email: admin@seda.org
 *                 nombre: Carlos Dispatcher
 *                 office: Despensa Norte
 *                 avatar: null
 *                 role: admin
 *                 created_at: "2026-05-11 10:00:00"
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Usuario no encontrado
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
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     description: Actualiza los datos de un usuario existente. Solo se actualizan los campos proporcionados.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: Carlos Hernández
 *             office: Despensa Sur
 *             role: supervisor
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 email: admin@seda.org
 *                 nombre: Carlos Hernández
 *                 office: Despensa Sur
 *                 avatar: null
 *                 role: supervisor
 *                 created_at: "2026-05-11 10:00:00"
 *               message: Usuario actualizado correctamente.
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Usuario no encontrado
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
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     description: Elimina un usuario del sistema de forma permanente.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *         example: 2
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Usuario eliminado correctamente.
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Usuario no encontrado
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
