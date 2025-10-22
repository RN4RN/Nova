import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import productsRoutes from "./routes/products.js";
import authRoutes from "./routes/authRoutes.js";
import warehouseRoutes from "./routes/warehouse.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";

const app = express();

// ⚙️ Configuración de CORS
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ✅ Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/warehouse", warehouseRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales", salesRoutes);

// 🔹 Servir el frontend (sin mover carpetas)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../frontend/build");

app.use(express.static(frontendPath));

// Cualquier ruta que no sea API devuelve el index.html del frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// 🟢 Puerto dinámico (Render asigna el suyo)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en puerto ${PORT}`);
});
