// backend/src/routes/products.js
import express from "express";
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategoryId, // 🆕 ¡Importa esta nueva función del modelo!
} from "../models/productsModel.js"; // Importa las funciones del modelo

const router = express.Router();

// Listar todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener productos", error: err.message });
  }
});

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener producto", error: err.message });
  }
});

// 🆕 NUEVA RUTA: Obtener productos por ID de categoría
router.get("/category/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await getProductsByCategoryId(categoryId); // Llama directamente a la función del modelo
    if (products.length === 0) {
      // Si no hay productos, devuelve un 200 con un array vacío.
      // Un 404 sería si la *categoría* no existiera o la ruta no existiera.
      // En este caso, la categoría existe, pero no tiene productos asociados.
      return res.json([]);
    }
    res.json(products);
  } catch (err) {
    console.error('Error al obtener productos por categoría:', err);
    res.status(500).json({ message: "Error interno del servidor al obtener productos por categoría", error: err.message });
  }
});


// Agregar producto
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    if (!data.name || data.name.trim() === "")
      return res.status(400).json({ message: "El nombre del producto es obligatorio" });

    const insertId = await addProduct(data);
    res.status(201).json({ message: "Producto agregado correctamente", id: insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al agregar producto", error: err.message });
  }
});

// Actualizar producto
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const affectedRows = await updateProduct(id, data);
    if (affectedRows > 0) {
      res.json({ message: "Producto actualizado correctamente" });
    } else {
      res.status(404).json({ message: "Producto no encontrado o sin cambios" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar producto", error: err.message });
  }
});

// Eliminar producto
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await deleteProduct(id);
    if (affectedRows > 0) {
      res.json({ message: "Producto eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar producto", error: err.message });
  }
});

export default router;