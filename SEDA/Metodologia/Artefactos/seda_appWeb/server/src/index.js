require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { authMiddleware } = require('./middleware/auth');

require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { font-size: 2rem; }
  `,
  customSiteTitle: 'SEDA API — Documentación Swagger',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true
  }
}));

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api/auth', require('./routes/auth.routes'));

app.use('/api/usuarios', authMiddleware, require('./routes/usuarios.routes'));
app.use('/api/donantes', authMiddleware, require('./routes/donantes.routes'));
app.use('/api/donaciones', authMiddleware, require('./routes/donaciones.routes'));
app.use('/api/lotes', authMiddleware, require('./routes/lotes.routes'));
app.use('/api/unidades', authMiddleware, require('./routes/unidades.routes'));
app.use('/api/incidencias', authMiddleware, require('./routes/incidencias.routes'));
app.use('/api/historial-rutas', authMiddleware, require('./routes/historial.routes'));
app.use('/api/alertas', authMiddleware, require('./routes/alertas.routes'));
app.use('/api/consolidacion', authMiddleware, require('./routes/consolidacion.routes'));
app.use('/api/routing', authMiddleware, require('./routes/routing.routes'));

app.get('/', (req, res) => {
  res.json({
    name: 'SEDA API',
    version: '1.0.0',
    description: 'Sistema de Entrega y Distribución Alimentaria',
    documentation: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      donantes: '/api/donantes',
      donaciones: '/api/donaciones',
      lotes: '/api/lotes',
      unidades: '/api/unidades',
      incidencias: '/api/incidencias',
      historial_rutas: '/api/historial-rutas',
      alertas: '/api/alertas',
      consolidacion: '/api/consolidacion',
      routing: '/api/routing'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    message: `La ruta ${req.method} ${req.path} no existe. Consulte la documentación en /api-docs`
  });
});

app.use((err, req, res, next) => {
  console.error(' Error:', err.message);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`\n SEDA API Server running on http://localhost:${PORT}`);
  console.log(` Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(` OpenAPI JSON: http://localhost:${PORT}/api-docs.json`);
  console.log(`\n Public endpoints:`);
  console.log(`   POST /api/auth/login`);
  console.log(`   POST /api/auth/register`);
  console.log(`\n Protected endpoints (JWT required):`);
  console.log(`   /api/usuarios`);
  console.log(`   /api/donantes`);
  console.log(`   /api/donaciones`);
  console.log(`   /api/lotes`);
  console.log(`   /api/unidades`);
  console.log(`   /api/incidencias`);
  console.log(`   /api/historial-rutas`);
  console.log(`   /api/alertas`);
  console.log(`   /api/consolidacion`);
  console.log(`   /api/routing\n`);
});
