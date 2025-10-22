// backend/src/controllers/supplierController.js
import supplierModel from '../models/supplierModel.js'; // Usa import y añade la extensión .js

const supplierController = {
  getAllSuppliers: async (req, res) => {
    try {
      const suppliers = await supplierModel.getAll();
      res.json(suppliers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener proveedores' });
    }
  },
  getSupplierById: async (req, res) => {
    try {
      const supplier = await supplierModel.getById(req.params.id);
      if (supplier) {
        res.json(supplier);
      } else {
        res.status(404).json({ message: 'Proveedor no encontrado' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener proveedor' });
    }
  },
  createSupplier: async (req, res) => {
    try {
      // supplierId es un objeto { id: insertId, ...supplier } o similar, ajusta la respuesta si solo necesitas el id
      const newSupplier = await supplierModel.create(req.body);
      res.status(201).json({ message: 'Proveedor creado con éxito', supplier: newSupplier });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al crear proveedor' });
    }
  },
  updateSupplier: async (req, res) => {
    try {
      const affectedRows = await supplierModel.update(req.params.id, req.body);
      if (affectedRows > 0) {
        res.json({ message: 'Proveedor actualizado con éxito' });
      } else {
        res.status(404).json({ message: 'Proveedor no encontrado o no se realizaron cambios' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al actualizar proveedor' });
    }
  },
  deleteSupplier: async (req, res) => {
    try {
      const affectedRows = await supplierModel.remove(req.params.id);
      if (affectedRows > 0) {
        res.json({ message: 'Proveedor eliminado con éxito' });
      } else {
        res.status(404).json({ message: 'Proveedor no encontrado' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al eliminar proveedor' });
    }
  },
};

export default supplierController; // Cambia a export default