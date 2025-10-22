// backend/src/routes/categoryRoutes.js
import express from 'express';
const router = express.Router();
import categoryController from '../controllers/categoryController.js'; // Asegúrate de la extensión .js

// Importa authMiddleware
import authMiddleware from '../middleware/authMiddleware.js'; // Importa el default

// Rutas de categorías

// 1. Rutas públicas (no requieren autenticación)
// Para obtener todas las categorías
router.get('/', categoryController.getAllCategories);
// Para obtener una categoría por ID (si la usas para mostrar detalles públicos)
router.get('/:id', categoryController.getCategoryById);

// 2. Rutas protegidas (requieren autenticación)
// Para crear una nueva categoría
router.post('/', authMiddleware, categoryController.createCategory);
// Para actualizar una categoría existente
router.put('/:id', authMiddleware, categoryController.updateCategory);
// Para eliminar una categoría
router.delete('/:id', authMiddleware, categoryController.deleteCategory);

export default router;