const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'seda_jwt_secret_key_2026_banco_alimentos';

/**
 * Middleware de autenticación JWT
 * Verifica el token Bearer en el header Authorization
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Acceso denegado',
      message: 'No se proporcionó token de autenticación. Incluya el header Authorization: Bearer <token>'
    });
  }

  // Expect format: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      error: 'Formato de token inválido',
      message: 'El header Authorization debe tener el formato: Bearer <token>'
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expirado',
        message: 'El token de autenticación ha expirado. Por favor, inicie sesión nuevamente.'
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token inválido',
        message: 'El token proporcionado no es válido.'
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Error de autenticación',
      message: 'Error interno al verificar el token.'
    });
  }
}

/**
 * Middleware de autorización por rol.
 * Debe usarse después de authMiddleware.
 * @param  {...string} roles - Roles permitidos
 */
function roleMiddleware(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
        message: 'Debe autenticarse primero.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Acceso prohibido',
        message: `No tiene permisos para esta acción. Se requiere uno de los roles: ${roles.join(', ')}`
      });
    }

    next();
  };
}

module.exports = { authMiddleware, roleMiddleware };
