import React, { useState } from "react";
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './log.css';
import { FaLock } from 'react-icons/fa'; // Importa el icono de candado de react-icons

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token);
        setMessage("Inicio de sesión exitoso ✅");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error en el servidor");
    }
  };

  return (
    <div className="auth-container">
      <h2><FaLock className="icon" /> Iniciar Sesión</h2> {/* Agregamos el icono aquí */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Usuario"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          required
        />
        <button type="submit">Entrar</button>
      </form>
      {message && <p className={message.includes("exitoso") ? "success-message" : "error-message"}>{message}</p>}

      <div className="register-option">
        <p>¿No tienes una cuenta?</p>
        <Link to="/register" className="register-button">
          Crear cuenta
        </Link>
      </div>
    </div>
  );
};

export default Login;