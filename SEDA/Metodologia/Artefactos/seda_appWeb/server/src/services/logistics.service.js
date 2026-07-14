const axios = require('axios');
const twilio = require('twilio');

const hasTwilioConfig = Boolean(
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_PHONE_NUMBER
);

const client = hasTwilioConfig
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const logisticsService = {
  async sendSMS(to, body) {
    if (!hasTwilioConfig || !client) {
      console.warn('Twilio no está configurado. SMS no enviado.', { to, body });
      return null;
    }

    return client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
  },

  async getRoute(coords, options = {}) {
    if (!coords) {
      throw new Error('Se requiere el parámetro coords. Formato: lon1,lat1;lon2,lat2');
    }

    const { overview = 'full', geometries = 'geojson', alternatives = false } = options;
    const baseUrl = process.env.OSRM_URL || 'https://router.project-osrm.org';
    const url = `${baseUrl}/route/v1/driving/${coords}?overview=${overview}&geometries=${geometries}&alternatives=${alternatives}`;
    const response = await axios.get(url);

    if (!response.data || !Array.isArray(response.data.routes) || response.data.routes.length === 0) {
      throw new Error('No se encontraron rutas desde OSRM. Verifique coords y el endpoint OSRM.');
    }

    return response.data.routes[0];
  },
};

module.exports = logisticsService;
