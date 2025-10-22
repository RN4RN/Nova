import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom"; // Importa Link
import api from "../services/api";
import { FaBox, FaSave, FaTimes } from 'react-icons/fa'; // Iconos
import './ProductForm.css'; // ¡Importa el archivo CSS aquí!
const ProductForm = () => {
  const { id } = useParams(); // Para modo edición
  const navigate = useNavigate();
  const [form, setForm] = useState({
    sku: "",
    barcode: "",
    name: "",
    description: "",
    presentation: "",
    unit_of_measure: "",
    location: "",
    category_id: "", // Para el ID de la categoría
    supplier_id: "", // Si también gestionas proveedores
    unit_price: 0.00,
    cost_price: 0.00,
    stock: 0,
    min_stock: 0,
  });
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]); // Para la lista desplegable de categorías
  const [suppliers, setSuppliers] = useState([]); // Para la lista desplegable de proveedores

  useEffect(() => {
    // Cargar categorías
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (error) {
        console.error("❌ Error al cargar categorías:", error);
      }
    };

    // Cargar proveedores
    const fetchSuppliers = async () => {
      try {
        const res = await api.get("/suppliers"); // Asume un endpoint /suppliers
        setSuppliers(res.data);
      } catch (error) {
        console.error("❌ Error al cargar proveedores:", error);
      }
    };

    fetchCategories();
    fetchSuppliers(); // Llama a cargar proveedores

    // Si estamos en modo edición, cargar datos del producto
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await api.get(`/products/${id}`);
          // Asegúrate de que los campos de la respuesta coincidan con tu estado
          setForm({
            sku: res.data.sku || "",
            barcode: res.data.barcode || "",
            name: res.data.name || "",
            description: res.data.description || "",
            presentation: res.data.presentation || "",
            unit_of_measure: res.data.unit_of_measure || "",
            location: res.data.location || "",
            category_id: res.data.category_id || "", // Asegura que el ID de la categoría se cargue
            supplier_id: res.data.supplier_id || "", // Asegura que el ID del proveedor se cargue
            unit_price: res.data.unit_price || 0.00,
            cost_price: res.data.cost_price || 0.00,
            stock: res.data.stock || 0,
            min_stock: res.data.min_stock || 0,
          });
        } catch (error) {
          console.error("❌ Error al cargar producto para edición:", error);
          setMessage("Error al cargar datos del producto.");
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // Convierte a número si es un campo numérico
    setForm({
      ...form,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // Modo edición
        await api.put(`/products/${id}`, form);
        setMessage("✅ Producto actualizado correctamente.");
      } else {
        // Modo creación
        await api.post("/products", form);
        setMessage("✅ Producto agregado correctamente.");
      }
      navigate("/products"); // Redirige a la lista de productos
    } catch (error) {
      console.error("❌ Error al guardar producto:", error.response?.data || error.message);
      setMessage(`❌ Error: ${error.response?.data?.message || "Hubo un problema al guardar el producto."}`);
    }
  };

  const handleCancel = () => {
    navigate("/products");
  };

  return (
    <div className="auth-container">
      <h2 className="form-title"><FaBox className="icon" /> {id ? "Editar Producto" : "Agregar Nuevo Producto"}</h2>
      <form onSubmit={handleSubmit} className="form-card">
        {/* SKU */}
        <label htmlFor="sku">SKU:</label>
        <input
          type="text"
          name="sku"
          placeholder="SKU del producto (ej: SKU001)"
          value={form.sku}
          onChange={handleChange}
        />

        {/* Código de Barras */}
        <label htmlFor="barcode">Código de Barras:</label>
        <input
          type="text"
          name="barcode"
          placeholder="Código de barras"
          value={form.barcode}
          onChange={handleChange}
        />

        {/* Nombre */}
        <label htmlFor="name">Nombre:</label>
        <input
          type="text"
          name="name"
          placeholder="Nombre del producto"
          value={form.name}
          onChange={handleChange}
          required
        />

        {/* Descripción */}
        <label htmlFor="description">Descripción:</label>
        <textarea
          name="description"
          placeholder="Descripción detallada del producto"
          value={form.description}
          onChange={handleChange}
          rows="3"
        ></textarea>

        {/* Presentación */}
        <label htmlFor="presentation">Presentación:</label>
        <input
          type="text"
          name="presentation"
          placeholder="Ej: Caja de 10, Frasco 50ml"
          value={form.presentation}
          onChange={handleChange}
        />

        {/* Unidad de Medida */}
        <label htmlFor="unit_of_measure">Unidad de Medida:</label>
        <input
          type="text"
          name="unit_of_measure"
          placeholder="Ej: Unidades, ml, gramos"
          value={form.unit_of_measure}
          onChange={handleChange}
        />

        {/* Ubicación */}
        <label htmlFor="location">Ubicación:</label>
        <input
          type="text"
          name="location"
          placeholder="Ej: Anaquel A1, Almacén"
          value={form.location}
          onChange={handleChange}
        />

        {/* Categoría (Select) */}
        <label htmlFor="category_id">Categoría:</label>
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {categories.length === 0 && <p className="info-message">No hay categorías. <Link to="/categories">Crea una aquí</Link>.</p>}

        {/* Proveedor (Select) - Nuevo Código */}
        <label htmlFor="supplier_id">Proveedor:</label>
        <select
          name="supplier_id"
          value={form.supplier_id}
          onChange={handleChange}
          // Puedes hacer que el proveedor sea opcional o requerido según tus necesidades
          // required
        >
          <option value="">Selecciona un proveedor</option>
          {suppliers.map((sup) => (
            <option key={sup.id} value={sup.id}>
              {sup.name}
            </option>
          ))}
        </select>
        {suppliers.length === 0 && <p className="info-message">No hay proveedores. <Link to="/suppliers">Crea uno aquí</Link>.</p>}

        {/* Precio Unitario */}
        <label htmlFor="unit_price">Precio Unitario (S/):</label>
        <input
          type="number"
          name="unit_price"
          placeholder="0.00"
          value={form.unit_price}
          onChange={handleChange}
          step="0.01"
          required
        />

        {/* Costo de Compra */}
        <label htmlFor="cost_price">Precio de Costo (S/):</label>
        <input
          type="number"
          name="cost_price"
          placeholder="0.00"
          value={form.cost_price}
          onChange={handleChange}
          step="0.01"
        />

        {/* Stock */}
        <label htmlFor="stock">Stock Actual:</label>
        <input
          type="number"
          name="stock"
          placeholder="0"
          value={form.stock}
          onChange={handleChange}
          min="0"
        />

        {/* Stock Mínimo */}
        <label htmlFor="min_stock">Stock Mínimo:</label>
        <input
          type="number"
          name="min_stock"
          placeholder="0"
          value={form.min_stock}
          onChange={handleChange}
          min="0"
        />

        <div className="form-actions">
          <button type="submit" className="save-button"><FaSave /> {id ? "Actualizar" : "Guardar Producto"}</button>
          <button type="button" onClick={handleCancel} className="cancel-button"><FaTimes /> Cancelar</button>
        </div>
      </form>
      {message && <p className={message.startsWith("✅") ? "success-message" : "error-message"}>{message}</p>}
    </div>
  );
};

export default ProductForm;