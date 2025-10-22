// backend/src/controllers/categoryController.js
import categoryModel from '../models/categoryModel.js'; // Usa import y la extensión .js

const categoryController = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await categoryModel.getAll();
      res.json(categories);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener categorías' });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const category = await categoryModel.getById(req.params.id);
      if (category) {
        res.json(category);
      } else {
        res.status(404).json({ message: 'Categoría no encontrada' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener categoría' });
    }
  },

  createCategory: async (req, res) => {
    try {
      const newCategory = await categoryModel.create(req.body);
      res.status(201).json({ message: 'Categoría creada con éxito', ...newCategory });
    } catch (err) {
      console.error(err);
      // Podrías añadir un chequeo para nombres duplicados aquí
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Ya existe una categoría con este nombre.' });
      }
      res.status(500).json({ message: 'Error al crear categoría' });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const affectedRows = await categoryModel.update(req.params.id, req.body);
      if (affectedRows > 0) {
        res.json({ message: 'Categoría actualizada con éxito' });
      } else {
        res.status(404).json({ message: 'Categoría no encontrada o no se realizaron cambios' });
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Ya existe una categoría con este nombre.' });
      }
      res.status(500).json({ message: 'Error al actualizar categoría' });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const affectedRows = await categoryModel.remove(req.params.id);
      if (affectedRows > 0) {
        res.json({ message: 'Categoría eliminada con éxito' });
      } else {
        res.status(404).json({ message: 'Categoría no encontrada' });
      }
    } catch (err) {
      console.error(err);
      // Manejar el error si hay productos asociados (depende de la configuración de tu DB)
      if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ message: 'No se puede eliminar la categoría porque tiene productos asociados.' });
      }
      res.status(500).json({ message: 'Error al eliminar categoría' });
    }
  },
};

export default categoryController; // Cambiado a exportación por defecto