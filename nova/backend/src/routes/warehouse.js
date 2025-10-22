// backend/src/routes/warehouse.js
import express from "express";
import {
  getProductDetail,
  addBatch,
  createPurchase,
  adjustStock,
  getAlerts,
  resolveAlert,
} from "../controllers/warehouseController.js";
// ¡CAMBIO AQUÍ! Importa authMiddleware como default
import authMiddleware from "../middleware/authMiddleware.js"; // Importa el default

const router = express.Router();

// Product detail (batches + movements)
router.get("/products/:id", authMiddleware, getProductDetail); // Usa authMiddleware

// batches
router.post("/batches", authMiddleware, addBatch); // Usa authMiddleware

// purchases
router.post("/purchases", authMiddleware, createPurchase); // Usa authMiddleware

// stock adjustments
router.post("/stock/adjust", authMiddleware, adjustStock); // Usa authMiddleware

// alerts
router.get("/alerts", authMiddleware, getAlerts); // Usa authMiddleware
router.post("/alerts/:id/resolve", authMiddleware, resolveAlert); // Usa authMiddleware

export default router;