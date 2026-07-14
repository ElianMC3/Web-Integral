# SEDA API Server

## Requisitos
- Node.js 18+ instalado
- Paquetes instalados con `npm install`
- Archivo `.env` configurado con las variables necesarias

## Variables de entorno
Crea un archivo `.env` basado en `.env.example` y completa los valores:

- `PORT`: Puerto del servidor (por ejemplo `3001`)
- `JWT_SECRET`: Clave secreta para JWT
- `JWT_EXPIRES_IN`: Tiempo de expiración del token JWT
- `DB_PATH`: Ruta a la base de datos SQLite
- `TWILIO_ACCOUNT_SID`: SID de Twilio para enviar SMS
- `TWILIO_AUTH_TOKEN`: Token de Twilio
- `TWILIO_PHONE_NUMBER`: Número de Twilio desde el que se envían los SMS
- `OSRM_URL`: URL del servicio OSRM. Si no se define, usa `https://router.project-osrm.org`

## Endpoints nuevos
- `GET /api/routing?coords=lon1,lat1;lon2,lat2` — Obtiene una ruta desde OSRM.

## Ejemplo de petición de ruta
```bash
curl "http://localhost:3001/api/routing?coords=-99.16357,19.42847;-99.11849,19.39196"
```

## Uso
```bash
cd server
npm install
npm run dev
```

## Notas
- El servicio Twilio se usa de forma segura: si no hay credenciales configuradas, el servidor seguirá funcionando y solo omitirá el envío de SMS.
- OpenStreetMap se consume a través de OSRM para cálculo de rutas.
