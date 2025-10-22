// backend/src/routes/customerRoutes.js
import { Router } from 'express';
import { searchCustomers, getCustomerById } from '../controllers/customerController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Ruta para buscar clientes por término
router.get('/search', authMiddleware, searchCustomers);

// Ruta para obtener un cliente por su ID (Opcional, pero útil)
router.get('/:id', authMiddleware, getCustomerById);

export default router;