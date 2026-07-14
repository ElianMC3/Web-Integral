const express = require('express');
const router = express.Router();
const controller = require('../controllers/routing.controller');

/**
 * @swagger
 * /api/routing:
 *   get:
 *     summary: Obtener ruta de navegación
 *     description: Devuelve una ruta calculada por OSRM según las coordenadas proporcionadas.
 *     tags: [Routing]
 *     parameters:
 *       - in: query
 *         name: coords
 *         required: true
 *         schema:
 *           type: string
 *         description: Coordenadas en formato lon1,lat1;lon2,lat2
 *       - in: query
 *         name: overview
 *         schema:
 *           type: string
 *           enum: [simplified, full, false]
 *         description: Tipo de resumen de la ruta
 *         example: full
 *       - in: query
 *         name: geometries
 *         schema:
 *           type: string
 *           enum: [geojson, polyline, polyline6]
 *         description: Formato de la geometría de la ruta
 *         example: geojson
 *       - in: query
 *         name: alternatives
 *         schema:
 *           type: boolean
 *         description: Incluir alternativas de ruta
 *         example: false
 *     responses:
 *       200:
 *         description: Ruta obtenida
 *       400:
 *         description: Parámetros faltantes
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', controller.getRoute);

module.exports = router;
