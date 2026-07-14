const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'SEDA API — Sistema de Entrega y Distribución Alimentaria',
      version: '1.0.0',
      description: `
API REST completa para el sistema SEDA que gestiona todo el flujo operativo:

- **Recepción** de donaciones con control de cadena de frío
- **Clasificación y Empacado** mediante tablero Kanban
- **Logística y Distribución** con gestión de unidades y rutas
- **Auditoría** con historial de rutas y alertas operativas

### Autenticación
Todos los endpoints (excepto \`/api/auth/login\` y \`/api/auth/register\`) requieren autenticación JWT.

Para autenticarse:
1. Use \`POST /api/auth/login\` con sus credenciales
2. Copie el token de la respuesta
3. Haga clic en el botón **Authorize** 🔒 arriba
4. Ingrese: \`Bearer <su_token>\`
      `,
      contact: {
        name: 'Equipo SEDA',
        email: 'soporte@seda.org'
      },
      license: {
        name: 'MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de Desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingrese su JWT token obtenido del endpoint /api/auth/login'
        }
      },
      schemas: {
        // ── Auth ──
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@seda.org' },
            password: { type: 'string', format: 'password', example: 'admin123' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            usuario: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                email: { type: 'string', example: 'admin@seda.org' },
                nombre: { type: 'string', example: 'Carlos Dispatcher' },
                office: { type: 'string', example: 'Despensa Norte' },
                role: { type: 'string', example: 'admin' }
              }
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'nombre'],
          properties: {
            email: { type: 'string', format: 'email', example: 'nuevo@seda.org' },
            password: { type: 'string', format: 'password', minLength: 6, example: 'mipassword123' },
            nombre: { type: 'string', example: 'María López' },
            office: { type: 'string', example: 'Despensa Sur' },
            role: { type: 'string', enum: ['admin', 'operador', 'supervisor', 'conductor'], example: 'operador' }
          }
        },

        // ── Usuario ──
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', example: 'carlos@seda.org' },
            nombre: { type: 'string', example: 'Carlos Dispatcher' },
            office: { type: 'string', example: 'Despensa Norte' },
            avatar: { type: 'string', nullable: true, example: null },
            role: { type: 'string', enum: ['admin', 'operador', 'supervisor', 'conductor'], example: 'operador' },
            created_at: { type: 'string', format: 'date-time', example: '2026-05-11T10:00:00.000Z' }
          }
        },

        // ── Donante ──
        Donante: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Supermercados La Granja' },
            empresa: { type: 'string', example: 'Supermercados La Granja S.A. de C.V.' },
            rfc: { type: 'string', example: 'SLG990101ABC' },
            telefono: { type: 'string', example: '55 1234 5678' },
            email: { type: 'string', example: 'contacto@lagranja.com' },
            direccion: { type: 'string', example: 'Av. Central 456, Col. Centro, Trujillo' },
            categoria: { type: 'string', example: 'Categoría A' },
            tipo: { type: 'string', enum: ['Recurrente', 'Eventual', 'Corporativo', 'Institucional'], example: 'Recurrente' },
            notas: { type: 'string', nullable: true, example: 'Donante frecuente, entregas los lunes y viernes' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        DonanteInput: {
          type: 'object',
          required: ['nombre'],
          properties: {
            nombre: { type: 'string', example: 'Juan Pérez García' },
            empresa: { type: 'string', example: 'Supermercados XYZ' },
            rfc: { type: 'string', example: 'XAXX010101000' },
            telefono: { type: 'string', example: '55 1234 5678' },
            email: { type: 'string', format: 'email', example: 'donante@empresa.com' },
            direccion: { type: 'string', example: 'Calle Principal 123, Col. Centro' },
            categoria: { type: 'string', example: 'Categoría A' },
            tipo: { type: 'string', enum: ['Recurrente', 'Eventual', 'Corporativo', 'Institucional'], example: 'Recurrente' },
            notas: { type: 'string', example: 'Días disponibles: Lunes a Viernes, horario matutino' }
          }
        },

        // ── Donación ──
        Donacion: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            codigo: { type: 'string', example: 'DON-8492' },
            donante_id: { type: 'integer', nullable: true, example: 1 },
            donor_name: { type: 'string', example: 'Supermercados La Granja' },
            category: { type: 'string', example: 'Abarrotes' },
            weight: { type: 'number', format: 'float', example: 250.0 },
            batch_number: { type: 'string', example: 'L-48290' },
            expiration_date: { type: 'string', format: 'date', example: '2026-08-20' },
            temperature: { type: 'number', format: 'float', example: 20.0 },
            vehicle_status: { type: 'string', enum: ['Óptimo', 'Regular', 'Deficiente'], example: 'Óptimo' },
            notes: { type: 'string', example: 'Llegada a tiempo. Cajas en perfecto estado.' },
            evidence_name: { type: 'string', nullable: true, example: 'mercancia_1.jpg' },
            status: { type: 'string', enum: ['Aprobado', 'Retenido', 'Pendiente Clasificación'], example: 'Aprobado' },
            issue_details: { type: 'string', nullable: true },
            timestamp: { type: 'string', example: '10:45 AM' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        DonacionInput: {
          type: 'object',
          required: ['donor_name', 'category', 'weight'],
          properties: {
            donante_id: { type: 'integer', example: 1 },
            donor_name: { type: 'string', example: 'Supermercados Cuitlahuac' },
            category: { type: 'string', example: 'Abarrotes' },
            weight: { type: 'number', format: 'float', example: 150.5 },
            batch_number: { type: 'string', example: 'L-48295' },
            expiration_date: { type: 'string', format: 'date', example: '2026-09-15' },
            temperature: { type: 'number', format: 'float', example: 18.0 },
            vehicle_status: { type: 'string', enum: ['Óptimo', 'Regular', 'Deficiente'], example: 'Óptimo' },
            notes: { type: 'string', example: 'Mercancía en buen estado, cajas selladas.' },
            evidence_name: { type: 'string', example: 'foto_donacion.jpg' },
            status: { type: 'string', enum: ['Aprobado', 'Retenido', 'Pendiente Clasificación'], example: 'Aprobado' },
            issue_details: { type: 'string', example: '' }
          }
        },
        DonacionStatusUpdate: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['Aprobado', 'Retenido', 'Pendiente Clasificación'], example: 'Aprobado' },
            issue_details: { type: 'string', example: 'Aprobado tras inspección de calidad' }
          }
        },

        // ── Lote (Tarea Kanban) ──
        Lote: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            codigo: { type: 'string', example: 'LOTE-9921' },
            title: { type: 'string', example: 'Lácteos Mixtos' },
            donor: { type: 'string', example: 'Supermercado A' },
            weight: { type: 'string', example: '150kg' },
            due_date: { type: 'string', example: 'Hoy 14:00' },
            status: { type: 'string', enum: ['Frío', 'Asignado', 'Sin asignar', 'Esperando Inspector'], example: 'Frío' },
            columna: { type: 'string', enum: ['PENDIENTE', 'EN_PROCESO', 'CONTROL_CALIDAD'], example: 'PENDIENTE' },
            progress: { type: 'integer', minimum: 0, maximum: 100, example: 0 },
            location: { type: 'string', nullable: true, example: null },
            assigned_to: { type: 'string', nullable: true, example: null },
            donacion_id: { type: 'integer', nullable: true, example: 1 },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        LoteInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', example: 'Clasificación Lote Frutas' },
            donor: { type: 'string', example: 'Productor Local' },
            weight: { type: 'string', example: '300kg' },
            due_date: { type: 'string', example: 'Hoy 18:00' },
            status: { type: 'string', enum: ['Frío', 'Asignado', 'Sin asignar', 'Esperando Inspector'], example: 'Sin asignar' },
            columna: { type: 'string', enum: ['PENDIENTE', 'EN_PROCESO', 'CONTROL_CALIDAD'], example: 'PENDIENTE' },
            assigned_to: { type: 'string', example: 'Carlos D.' },
            donacion_id: { type: 'integer', example: 1 }
          }
        },
        LoteMover: {
          type: 'object',
          required: ['columna'],
          properties: {
            columna: { type: 'string', enum: ['PENDIENTE', 'EN_PROCESO', 'CONTROL_CALIDAD'], example: 'EN_PROCESO' }
          }
        },

        // ── Unidad Logística ──
        Unidad: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            codigo: { type: 'string', example: 'TR-01' },
            driver: { type: 'string', example: 'Miguel Ángel' },
            type: { type: 'string', enum: ['Refrigerado', 'Seco'], example: 'Refrigerado' },
            capacity: { type: 'string', example: '12T' },
            load_percentage: { type: 'integer', minimum: 0, maximum: 100, example: 85 },
            temp: { type: 'string', nullable: true, example: '-18°C' },
            eta: { type: 'string', nullable: true, example: '14:30' },
            status_badge: { type: 'string', nullable: true, example: null },
            location: { type: 'string', nullable: true, example: null },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        UnidadInput: {
          type: 'object',
          required: ['driver', 'type', 'capacity'],
          properties: {
            codigo: { type: 'string', example: 'TR-05' },
            driver: { type: 'string', example: 'José Hernández' },
            type: { type: 'string', enum: ['Refrigerado', 'Seco'], example: 'Refrigerado' },
            capacity: { type: 'string', example: '10T' },
            load_percentage: { type: 'integer', example: 0 },
            temp: { type: 'string', example: '-20°C' },
            eta: { type: 'string', example: '16:00' },
            status_badge: { type: 'string', example: '' },
            location: { type: 'string', example: 'Andén 3' }
          }
        },

        // ── Incidencia ──
        Incidencia: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            codigo: { type: 'string', example: 'INC-01' },
            title: { type: 'string', example: 'Desvío de Ruta (TR-02)' },
            unit: { type: 'string', example: 'TR-02' },
            status: { type: 'string', enum: ['active', 'reviewed'], example: 'active' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        IncidenciaInput: {
          type: 'object',
          required: ['title', 'unit'],
          properties: {
            title: { type: 'string', example: 'Fallo mecánico en unidad TR-03' },
            unit: { type: 'string', example: 'TR-03' }
          }
        },

        // ── Historial de Ruta ──
        HistorialRuta: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            codigo: { type: 'string', example: 'HIST-01' },
            driver: { type: 'string', example: 'Miguel Ángel (TR-01)' },
            unit: { type: 'string', example: 'TR-01' },
            action_text: { type: 'string', example: 'completó la entrega del' },
            lote: { type: 'string', example: 'LOTE-9918' },
            details: { type: 'string', example: 'Destino: Zona Sur (Despensas comunitarias, Sector 2) • Tipo: Perecederos' },
            time: { type: 'string', example: '14:30 PM' },
            date: { type: 'string', example: '11/05/2026' },
            status_badge: { type: 'string', example: 'Entrega Exitosa' },
            status_color: { type: 'string', example: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
            extra_badge: { type: 'string', nullable: true, example: 'Temp Final: -17.8°C' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        HistorialRutaInput: {
          type: 'object',
          required: ['driver', 'unit', 'action_text'],
          properties: {
            driver: { type: 'string', example: 'Roberto P. (CV-04)' },
            unit: { type: 'string', example: 'CV-04' },
            action_text: { type: 'string', example: 'completó la entrega del' },
            lote: { type: 'string', example: 'LOTE-9920' },
            details: { type: 'string', example: 'Destino: Comedor Comunitario Esperanza • Tipo: Secos' },
            time: { type: 'string', example: '16:45 PM' },
            date: { type: 'string', example: '12/05/2026' },
            status_badge: { type: 'string', example: 'Entrega Exitosa' },
            status_color: { type: 'string', example: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
            extra_badge: { type: 'string', example: '' }
          }
        },

        // ── Alerta Operativa ──
        Alerta: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            codigo: { type: 'string', example: 'ALERT-01' },
            type: { type: 'string', enum: ['caducidad', 'incidencia'], example: 'caducidad' },
            title: { type: 'string', example: 'Caducidad Próxima (Lácteos)' },
            level: { type: 'string', enum: ['URGENTE', 'RETRASO'], example: 'URGENTE' },
            description: { type: 'string', example: 'DON L-4592 (150kg) caduca en 48h.' },
            details: { type: 'string', example: 'Ubicación: Cámara Frío 2, Pasillo B.' },
            resolved: { type: 'boolean', example: false },
            contact_name: { type: 'string', nullable: true, example: null },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        AlertaInput: {
          type: 'object',
          required: ['type', 'title', 'level'],
          properties: {
            type: { type: 'string', enum: ['caducidad', 'incidencia'], example: 'caducidad' },
            title: { type: 'string', example: 'Caducidad Próxima (Carnes)' },
            level: { type: 'string', enum: ['URGENTE', 'RETRASO'], example: 'URGENTE' },
            description: { type: 'string', example: 'Lote de carnes C-1020 (80kg) caduca en 24h.' },
            details: { type: 'string', example: 'Ubicación: Cámara Frío 1, Pasillo A.' },
            contact_name: { type: 'string', example: 'Roberto P. (CV-04)' }
          }
        },
        AlertaResolver: {
          type: 'object',
          required: ['action'],
          properties: {
            action: { type: 'string', example: 'Asignado a ruta rápida' }
          }
        },

        // ── Consolidación ──
        ConsolidacionItem: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            codigo: { type: 'string', example: 'LOTE-9901' },
            category: { type: 'string', example: 'No Perecederos' },
            weight: { type: 'number', format: 'float', example: 50.0 },
            destination: { type: 'string', example: 'Despensa Centro' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        ConsolidacionItemInput: {
          type: 'object',
          required: ['codigo', 'category', 'weight'],
          properties: {
            codigo: { type: 'string', example: 'LOTE-9910' },
            category: { type: 'string', example: 'Perecederos' },
            weight: { type: 'number', format: 'float', example: 75.0 },
            destination: { type: 'string', example: 'Despensa Norte' }
          }
        },

        // ── Respuestas Genéricas ──
        Error401: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Acceso denegado' },
            message: { type: 'string', example: 'No se proporcionó token de autenticación.' }
          }
        },
        Error403: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Acceso prohibido' },
            message: { type: 'string', example: 'No tiene permisos para esta acción.' }
          }
        },
        Error404: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'No encontrado' },
            message: { type: 'string', example: 'El recurso solicitado no existe.' }
          }
        },
        Error500: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Error interno del servidor' },
            message: { type: 'string' }
          }
        }
      }
    },
    security: [{ BearerAuth: [] }],
    tags: [
      { name: 'Autenticación', description: 'Endpoints de login y registro (públicos)' },
      { name: 'Usuarios', description: 'Gestión de usuarios del sistema' },
      { name: 'Donantes', description: 'Gestión de donantes (personas y organizaciones)' },
      { name: 'Donaciones', description: 'Recepción y registro de donaciones' },
      { name: 'Lotes', description: 'Tareas del tablero Kanban de empacado y clasificación' },
      { name: 'Unidades', description: 'Unidades de transporte logístico' },
      { name: 'Incidencias', description: 'Incidencias de transporte y logística' },
      { name: 'Historial de Rutas', description: 'Registro histórico y auditoría de rutas' },
      { name: 'Alertas', description: 'Alertas operativas (caducidad, incidencias)' },
      { name: 'Consolidación', description: 'Consolidación rápida de lotes para despacho' }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
