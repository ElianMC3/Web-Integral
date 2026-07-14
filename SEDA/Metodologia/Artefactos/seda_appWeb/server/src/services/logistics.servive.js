const axios = require('axios');
const twilio = require('twilio');

// Configuración Twilio usando variables de entorno[cite: 2]
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const logisticsService = {
  // Enviar SMS vía Twilio
  async sendSMS(to, body) {
    try {
      return await client.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to
      });
    } catch (error) {
      console.error('Error enviando SMS:', error);
      throw error;
    }
  },

  // Obtener ruta con OSRM
  async getRoute(coords) {
    // coords esperado formato: "lon1,lat1;lon2,lat2"
    const url = `${process.env.OSRM_URL || 'https://router.project-osrm.org'}/route/v1/driving/${coords}?overview=full&geometries=geojson`;
    const response = await axios.get(url);
    return response.data.routes[0];
  }
};

module.exports = logisticsService;