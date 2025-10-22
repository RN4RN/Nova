// src/components/ProductList.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { FaBox, FaPlus, FaEdit, FaTrash, FaDollarSign, FaBoxes, FaBarcode, FaInfoCircle, FaWeightHanging, FaMapMarkerAlt, FaTags, FaPalette, FaShoppingCart, FaTruck } from 'react-icons/fa'; // Importa FaTruck para proveedores
import './ProductList.css'; // Asegúrate de que la ruta sea correcta
const ProductList = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("❌ Error al cargar productos:", error);
      alert("❌ Error al cargar productos. Revisa la consola para más detalles.");
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      try {
        await api.delete(`/products/${id}`);
        alert("✅ Producto eliminado correctamente");
        fetchProducts(); // Recargar la lista después de eliminar
      } catch (error) {
        console.error("❌ Error al eliminar producto:", error);
        alert("❌ Error al eliminar producto. Revisa la consola para más detalles.");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="auth-container">
      <h2 className="form-title"><FaBox className="icon" /> Lista de Productos</h2>
      <div className="product-list-actions">
        <Link to="/add" className="add-product-button">
          <FaPlus className="icon-small" /> Agregar Producto
        </Link>
        <Link to="/categories" className="manage-categories-button">
          <FaTags className="icon-small" /> Gestionar Categorías
        </Link>
        {/* ¡NUEVO BOTÓN PARA PROVEEDORES! */}
        <Link to="/suppliers/new" className="manage-suppliers-button"> {/* Ajusta la ruta si es necesario */}
          <FaTruck className="icon-small" /> Añadir Proveedor
        </Link>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th><FaBarcode className="icon-small" /> SKU</th>
              <th><FaInfoCircle className="icon-small" /> Nombre</th>
              <th><FaPalette className="icon-small" /> Presentación</th>
              <th><FaWeightHanging className="icon-small" /> Unidad Medida</th>
              <th><FaMapMarkerAlt className="icon-small" /> Ubicación</th>
              <th><FaTags className="icon-small" /> Categoría</th>
              <th><FaDollarSign className="icon-small" /> Precio (S/)</th>
              <th><FaShoppingCart className="icon-small" /> Costo (S/)</th>
              <th><FaBoxes className="icon-small" /> Stock</th>
              <th><FaPlus className="icon-small" /> Min Stock</th>
              <th><FaEdit className="icon-small" /> Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id}>
                  <td>{p.sku || 'N/A'}</td>
                  <td>{p.name}</td>
                  <td>{p.presentation || 'N/A'}</td>
                  <td>{p.unit_of_measure || 'N/A'}</td>
                  <td>{p.location || 'N/A'}</td>
                  <td>{p.category_name || 'Sin Categoría'}</td>
                  <td>{p.unit_price}</td>
                  <td>{p.cost_price || '0.00'}</td>
                  <td>{p.stock}</td>
                  <td>{p.min_stock || '0'}</td>
                  <td className="actions-cell">
                    <Link to={`/products/edit/${p.id}`} className="action-button edit-button">
                      <FaEdit />
                    </Link>
                    <button
                      className="action-button delete-button"
                      onClick={() => deleteProduct(p.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11">No hay productos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;