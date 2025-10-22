// src/pages/CategoryProductsPage.jsx (o donde organices tus páginas)
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Para obtener los parámetros de la URL
import './CategoryProductsPage.css'; // Crea este archivo CSS

const CategoryProductsPage = () => {
  const { categoryId, categoryName } = useParams(); // Obtiene categoryId y categoryName de la URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Decodificar el nombre de la categoría si es necesario (ej. si tiene espacios o caracteres especiales)
  const decodedCategoryName = decodeURIComponent(categoryName.replace(/-/g, ' '));

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        // Ajusta esta URL a tu endpoint del backend para productos por categoría
        const response = await fetch(`http://localhost:4000/api/products/category/${categoryId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchProductsByCategory();
    }
  }, [categoryId]); // Vuelve a ejecutar cuando categoryId cambie

  if (loading) {
    return (
      <div className="category-products-container">
        <h2>{decodedCategoryName}</h2>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-products-container">
        <h2>{decodedCategoryName}</h2>
        <p>Error al cargar los productos: {error}</p>
      </div>
    );
  }

  return (
    <div className="category-products-container">
      <h2>Productos en {decodedCategoryName}</h2>
      {products.length > 0 ? (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p>Precio: ${product.price ? product.price.toFixed(2) : 'N/A'}</p>
              <p>Stock: {product.stock || 0}</p>
              {/* Añade más detalles del producto según tu modelo */}
              <p className="product-description">{product.description || 'Sin descripción'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No se encontraron productos para esta categoría.</p>
      )}
    </div>
  );
};

export default CategoryProductsPage;