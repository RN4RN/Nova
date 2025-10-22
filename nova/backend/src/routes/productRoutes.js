// backend/src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware'); // Si tienes middleware de autenticación

// Rutas de productos (puedes añadir middleware de autenticación si es necesario)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct); // Asumiendo que el usuario autenticado tiene permiso
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;