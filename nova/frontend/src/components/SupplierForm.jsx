// frontend/src/components/SupplierForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SupplierForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      // ✅ ¡CAMBIO AQUÍ! Ahora obtenemos el token usando la clave 'authToken'
      const token = localStorage.getItem('authToken'); // Usar 'authToken' consistente con AuthContext
      
      if (!token) {
        setError("No estás autenticado. Por favor, inicia sesión.");
        navigate('/login'); // Opcional: Redirigir al login si no hay token
        return;
      }

      console.log("Token obtenido para SupplierForm:", token); // Para depuración
      
      const response = await axios.post('http://localhost:4000/api/suppliers', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setMessage('Proveedor creado con éxito!');
      setFormData({
        name: '',
        contact_person: '',
        phone: '',
        email: '',
        address: '',
      });
      console.log(response.data);
    } catch (err) {
      console.error('Error al crear proveedor:', err);
      // Ajusta el mensaje de error para reflejar mejor el 401
      if (err.response && err.response.status === 401) {
        setError("Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.");
        navigate('/login'); // Redirige al login en caso de 401
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || 'Error al crear proveedor.');
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Añadir Nuevo Proveedor</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">Nombre del Proveedor:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact_person">Persona de Contacto:</label>
          <input
            type="text"
            id="contact_person"
            name="contact_person"
            value={formData.contact_person}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Teléfono:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Dirección:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">Añadir Proveedor</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default SupplierForm;