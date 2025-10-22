// backend/src/models/categoryModel.js
import db from '../config/db.js'; // Usa import y la extensión .js

const categoryModel = {
  // Obtener todas las categorías
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY name ASC');
    return rows;
  },

  // Obtener una categoría por ID
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
  },

  // Crear una nueva categoría
  create: async (category) => {
    const { name, description } = category;
    const [result] = await db.query(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description]
    );
    return { id: result.insertId, name, description };
  },

  // Actualizar una categoría
  update: async (id, category) => {
    const { name, description } = category;
    const [result] = await db.query(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );
    return result.affectedRows;
  },

  // Eliminar una categoría
  remove: async (id) => {
    // Antes de eliminar una categoría, considera si tiene productos asociados.
    // Podrías establecer `category_id` de los productos a NULL o prohibir la eliminación.
    // Aquí, `ON DELETE SET NULL` en la FK de la DB se encarga.
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows;
  },
};

export default categoryModel; // Cambiado a exportación por defecto