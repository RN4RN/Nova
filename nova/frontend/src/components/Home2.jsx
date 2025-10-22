// src/components/Home2.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './Home2.css';

const Home2 = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Inicializa useNavigate

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/categories');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Nueva función para manejar el clic en la tarjeta
  const handleCategoryClick = (categoryId, categoryName) => {
    // Navega a una ruta como /category/1/Patillas
    navigate(`/category/${categoryId}/${categoryName.replace(/\s+/g, '-')}`);
  };

  if (loading) {
    return <div className="home-container-logged-in">Cargando categorías...</div>;
  }

  if (error) {
    return <div className="home-container-logged-in">Error: {error}</div>;
  }

  return (
    <div className="home-container-logged-in">
      <h1>¡Bienvenido de nuevo a Botica Nova Salud!</h1>
      <p>Explora tus opciones: gestiona productos, realiza ventas y más.</p>

      <h2>Nuestras Categorías de Productos</h2>
      <div className="categories-grid">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => handleCategoryClick(category.id, category.name)} // Añade el onClick
            >
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>
          ))
        ) : (
          <p>No hay categorías disponibles.</p>
        )}
      </div>

      <div className="home2-features">
        {/* ... Tus tarjetas de funciones existentes ... */}
        <div className="feature-card">
          <h3>Productos</h3>
          <p>Ve tu inventario y añade nuevos artículos.</p>
        </div>
        <div className="feature-card">
          <h3>Realizar Venta</h3>
          <p>Procesa nuevas transacciones de forma rápida.</p>
        </div>
        <div className="feature-card">
          <h3>Ajuste de Stock</h3>
          <p>Actualiza las cantidades de tus productos.</p>
        </div>
      </div>
    </div>
  );
};

export default Home2;