// src/components/Register.js
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    full_name: "",
    email: "",
    phone_number: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        // Si el registro fue exitoso, redirige al usuario a la página de login
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error al registrar usuario");
    }
  };

  return (
    <div className="auth-container">
      <h2>🧾 Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Usuario" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
        <input type="text" name="full_name" placeholder="Nombre completo" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} required />
        <input type="text" name="phone_number" placeholder="Teléfono" onChange={handleChange} required />
        <button type="submit">Registrar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;