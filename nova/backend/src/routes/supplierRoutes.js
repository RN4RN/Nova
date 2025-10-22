// backend/src/routes/supplierRoutes.js
import express from 'express';
const router = express.Router();
import supplierController from '../controllers/supplierController.js'; // Ya con .js y esperando export default
import authMiddleware from '../middleware/authMiddleware.js'; // Asegúrate de que este también use export default

router.get('/', authMiddleware, supplierController.getAllSuppliers);
router.get('/:id', authMiddleware, supplierController.getSupplierById);
router.post('/', authMiddleware, supplierController.createSupplier);
router.put('/:id', authMiddleware, supplierController.updateSupplier);
router.delete('/:id', authMiddleware, supplierController.deleteSupplier);

export default router;