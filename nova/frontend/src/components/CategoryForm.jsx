// src/components/CategoryForm.jsx
import React, { useState, useEffect } from "react";
import api from "../services/api"; // Asegúrate de que tu instancia de axios esté configurada
import { FaPlus, FaTag, FaListAlt, FaTrash } from 'react-icons/fa'; // Iconos para categorías
import '../App.css'; // O un archivo CSS específico para CategoryForm

const CategoryForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]); // Para listar categorías existentes

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories"); // Asume que tienes un endpoint para /categories
      setCategories(res.data);
    } catch (error) {
      console.error("❌ Error al cargar categorías:", error);
      setMessage("Error al cargar categorías.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/categories", { name, description }); // Endpoint para añadir categoría
      setMessage(`✅ Categoría "${res.data.name}" agregada.`);
      setName("");
      setDescription("");
      fetchCategories(); // Recargar la lista de categorías
    } catch (error) {
      console.error("❌ Error al agregar categoría:", error);
      setMessage("Error al agregar categoría.");
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      try {
        await api.delete(`/categories/${id}`); // Endpoint para eliminar categoría
        setMessage("✅ Categoría eliminada correctamente.");
        fetchCategories(); // Recargar la lista después de eliminar
      } catch (error) {
        console.error("❌ Error al eliminar categoría:", error);
        setMessage("Error al eliminar categoría. Asegúrate de que no tenga productos asociados.");
      }
    }
  };


  return (
    <div className="auth-container"> {/* Reutilizamos la clase auth-container para el estilo */}
      <h2 className="form-title"><FaTag className="icon" /> Gestionar Categorías</h2>

      {/* Formulario para agregar categoría */}
      <form onSubmit={handleSubmit} className="form-card"> {/* Clase para el formulario */}
        <h3><FaPlus className="icon-small" /> Agregar Nueva Categoría</h3>
        <input
          type="text"
          placeholder="Nombre de la categoría"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Descripción de la categoría (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
        ></textarea>
        <button type="submit">Crear Categoría</button>
      </form>

      {message && <p className={message.startsWith("✅") ? "success-message" : "error-message"}>{message}</p>}

      {/* Lista de categorías existentes */}
      <div className="category-list-section">
        <h3><FaListAlt className="icon-small" /> Categorías Existentes</h3>
        {categories.length > 0 ? (
          <ul className="category-list">
            {categories.map((cat) => (
              <li key={cat.id} className="category-item">
                <span className="category-item-name">{cat.name}</span>
                <p className="category-item-description">{cat.description || "Sin descripción"}</p>
                <button
                  className="delete-category-button"
                  onClick={() => deleteCategory(cat.id)}
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay categorías registradas.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryForm;