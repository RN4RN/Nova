// backend/src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// IMPORTANTE: Asegúrate de que esta clave sea EXACTAMENTE la misma
// que usas en backend/src/controllers/authController.js para firmar el token.
// Si en authController.js tienes 'process.env.JWT_SECRET', entonces aquí también debes usarlo,
// asegurándote de que .env esté cargado al inicio de app.js
const SECRET_KEY = "clave_super_secreta_123";
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    console.warn("Middleware Auth: No se proporcionó la cabecera Authorization.");
    return res.status(401).json({ error: "No token provided" });
  }

  // Esperamos "Bearer <token>"
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    console.warn(`Middleware Auth: Formato de token inválido: ${header}`);
    return res.status(401).json({ error: "Invalid token format. Must be 'Bearer <token>'" });
  }

  const token = parts[1];

  if (!token) {
    console.warn("Middleware Auth: El token está vacío después de 'Bearer'.");
    return res.status(401).json({ error: "Token is empty" });
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload; // { id, username, role }
    next();
  } catch (err) {
    // Aquí podemos loguear el error específico de JWT para entender por qué falla la verificación
    console.error("Middleware Auth: Error al verificar el token JWT:", err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired" });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid token" });
    }
    return res.status(401).json({ error: "Authentication failed" });
  }
};

export default authMiddleware;