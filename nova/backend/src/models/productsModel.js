// backend/src/models/productsModel.js
import db from "../config/db.js"; // Usamos 'db' como el pool de conexiones

/**
 * Modelo de productos (async/await, compatible con mysql2/promise)
 * Exporta funciones individuales y un objeto por defecto.
 */

// Obtener todos los productos (incluye nombre de categoría y proveedor)
export const getAllProducts = async () => {
  const [rows] = await db.query(`
    SELECT p.*, c.name AS category_name, s.name AS supplier_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN suppliers s ON p.supplier_id = s.id
    ORDER BY p.id DESC
  `);
  return rows;
};

// Obtener un producto por ID
export const getProductById = async (id) => {
  const [rows] = await db.query(`
    SELECT p.*, c.name AS category_name, s.name AS supplier_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN suppliers s ON p.supplier_id = s.id
    WHERE p.id = ?
  `, [id]);
  return rows[0] || null;
};

// 🆕 Obtener productos por ID de categoría
export const getProductsByCategoryId = async (categoryId) => {
  const [rows] = await db.query(`
    SELECT p.*, c.name AS category_name, s.name AS supplier_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN suppliers s ON p.supplier_id = s.id
    WHERE p.category_id = ?
    ORDER BY p.name ASC
  `, [categoryId]);
  return rows;
};

// Agregar un producto
export const addProduct = async (data) => {
  const sql = `
    INSERT INTO products (
      sku, barcode, name, description, presentation, unit_of_measure,
      location, category_id, supplier_id, unit_price, cost_price,
      stock, min_stock
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.sku || null,
    data.barcode || null,
    data.name,
    data.description || null,
    data.presentation || null,
    data.unit_of_measure || null,
    data.location || null,
    data.category_id || null,
    data.supplier_id || null,
    data.unit_price || 0,
    data.cost_price || 0,
    data.stock || 0,
    data.min_stock || 0,
  ];
  const [result] = await db.query(sql, values);
  return result.insertId;
};

// Actualizar un producto
export const updateProduct = async (id, data) => {
  const sql = `
    UPDATE products SET
      sku = ?, barcode = ?, name = ?, description = ?, presentation = ?,
      unit_of_measure = ?, location = ?, category_id = ?, supplier_id = ?,
      unit_price = ?, cost_price = ?, stock = ?, min_stock = ?
    WHERE id = ?
  `;
  const values = [
    data.sku || null,
    data.barcode || null,
    data.name,
    data.description || null,
    data.presentation || null,
    data.unit_of_measure || null,
    data.location || null,
    data.category_id || null,
    data.supplier_id || null,
    data.unit_price || 0,
    data.cost_price || 0,
    data.stock || 0,
    data.min_stock || 0,
    id,
  ];
  const [result] = await db.query(sql, values);
  return result.affectedRows;
};

// Eliminar un producto
export const deleteProduct = async (id) => {
  const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);
  return result.affectedRows;
};

// Objeto por defecto para compatibilidad (incluye la nueva función)
const productModel = {
  getAll: getAllProducts,
  getById: getProductById,
  create: addProduct,
  update: updateProduct,
  remove: deleteProduct,
  getProductsByCategoryId: getProductsByCategoryId, // 🆕 Añadido
};

export default productModel;