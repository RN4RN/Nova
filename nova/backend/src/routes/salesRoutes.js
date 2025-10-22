// backend/src/routes/salesRoutes.js
import { Router } from 'express';
import { createSale, getSalesHistory } from '../controllers/salesController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Ruta para crear una nueva venta (requiere autenticación)
router.post('/', authMiddleware, createSale);

// Ruta para obtener el historial de ventas (requiere autenticación)
router.get('/', authMiddleware, getSalesHistory); // Podrías añadir paginación y filtros

export default router;