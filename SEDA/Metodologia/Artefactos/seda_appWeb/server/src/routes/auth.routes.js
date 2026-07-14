const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: |
 *       Autentica un usuario con email y contraseña.
 *       Retorna un JWT token válido por 24 horas y los datos del usuario.
 *
 *       **Este endpoint es público** — no requiere autenticación.
 *
 *       ### Credenciales de prueba
 *       | Email | Password | Rol |
 *       |-------|----------|-----|
 *       | admin@seda.org | admin123 | admin |
 *       | operador@seda.org | operador123 | operador |
 *       | supervisor@seda.org | supervisor123 | supervisor |
 *       | conductor@seda.org | conductor123 | conductor |
 *     tags: [Autenticación]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             admin:
 *               summary: Login como administrador
 *               value:
 *                 email: admin@seda.org
 *                 password: admin123
 *             operador:
 *               summary: Login como operador
 *               value:
 *                 email: operador@seda.org
 *                 password: operador123
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             example:
 *               success: true
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               usuario:
 *                 id: 1
 *                 email: admin@seda.org
 *                 nombre: Carlos Dispatcher
 *                 office: Despensa Norte
 *                 role: admin
 *       400:
 *         description: Datos incompletos
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: Datos incompletos
 *               message: Se requiere email y password.
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: Credenciales inválidas
 *               message: El email o la contraseña son incorrectos.
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     description: |
 *       Crea una nueva cuenta de usuario en el sistema SEDA.
 *       Retorna automáticamente un JWT token para el nuevo usuario.
 *
 *       **Este endpoint es público** — no requiere autenticación.
 *     tags: [Autenticación]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           example:
 *             email: nuevo@seda.org
 *             password: mipassword123
 *             nombre: María López
 *             office: Despensa Sur
 *             role: operador
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               usuario:
 *                 id: 5
 *                 email: nuevo@seda.org
 *                 nombre: María López
 *                 office: Despensa Sur
 *                 role: operador
 *                 created_at: "2026-05-11 10:00:00"
 *       400:
 *         description: Datos incompletos o contraseña muy corta
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: Datos incompletos
 *               message: Se requiere email, password y nombre.
 *       409:
 *         description: El email ya existe
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: Conflicto
 *               message: Ya existe un usuario registrado con ese email.
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.post('/register', authController.register);

module.exports = router;
