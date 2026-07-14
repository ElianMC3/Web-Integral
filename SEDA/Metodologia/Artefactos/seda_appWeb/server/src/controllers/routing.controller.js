const logisticsService = require('../services/logistics.service');

exports.getRoute = async (req, res) => {
  try {
    const { coords, overview = 'full', geometries = 'geojson', alternatives = 'false' } = req.query;

    if (!coords) {
      return res.status(400).json({
        success: false,
        error: 'Faltan parámetros',
        message: 'El parámetro coords es obligatorio. Ejemplo: lon1,lat1;lon2,lat2',
      });
    }

    const route = await logisticsService.getRoute(coords, {
      overview,
      geometries,
      alternatives: alternatives === 'true',
    });

    res.json({ success: true, data: route });
  } catch (error) {
    console.error('Error en routing controller:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message,
    });
  }
};
