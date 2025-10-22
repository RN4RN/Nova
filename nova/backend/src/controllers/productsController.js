// backend/src/controllers/productController.js
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  searchProductsInDB, // 🆕 Importa la nueva función del modelo
} from "../models/productsModel.js";

// Listar todos los productos
export const listarProductos = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener productos", error: err.message });
  }
};

// Obtener un producto por ID
export const obtenerProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener producto", error: err.message });
  }
};

// Agregar producto
export const agregarProducto = async (req, res) => {
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
};

// Actualizar producto
export const actualizarProducto = async (req, res) => {
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
};

// Eliminar producto
export const eliminarProducto = async (req, res) => {
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
};

// **NUEVO**: Función para buscar productos
export const searchProducts = async (req, res) => {
  const { term } = req.query; // El término de búsqueda que viene del frontend

  if (!term || term.length < 2) { // Puedes ajustar el mínimo de caracteres
    return res.status(400).json({ message: "El término de búsqueda debe tener al menos 2 caracteres." });
  }

  try {
    const products = await searchProductsInDB(term); // Llama a la función del modelo
    res.json(products);
  } catch (err) {
    console.error("Error en productController.js al buscar productos:", err);
    res.status(500).json({ message: "Error interno del servidor al buscar productos.", error: err.message });
  }
};