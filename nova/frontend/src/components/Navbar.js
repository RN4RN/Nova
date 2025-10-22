// src/components/Navbar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "./navegadorXD.css"; // Asegúrate de que este sea el CSS que contiene los estilos

// Importa iconos de alguna librería. Por ejemplo, si usas react-icons:
// npm install react-icons
import { FaHome, FaBox, FaPlus, FaShoppingCart, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();

  const getActiveClass = (path) =>
    location.pathname === path ? "active-link" : "";

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      {/* 🟦 Logo + Marca - AHORA EL LOGO ES UN ENLACE AL HOME */}
      <div className="navbar-left">
        <Link to="/" className="navbar-brand"> {/* El Link envuelve el logo */}
          <img
            src="/images/logo.png"
            alt="Botica Nova Salud Logo"
            className="navbar-logo"
          />
          {/* Si quieres añadir un texto al lado del logo, descomenta esto: */}
          {/* <span className="navbar-brand-text">Botica Nova Salud</span> */}
        </Link>
      </div>

      {/* 📁 Enlaces */}
      <ul className="navbar-links">
        <li>
          <Link to="/" className={getActiveClass("/")}>
            <FaHome className="icon" /> Inicio
          </Link>
        </li>

        {isLoggedIn && (
          <>
            <li>
              <Link to="/products" className={getActiveClass("/products")}>
                <FaBox className="icon" /> Productos
              </Link>
            </li>
            <li>
              <Link to="/add" className={getActiveClass("/add")}>
                <FaPlus className="icon" /> Agregar
              </Link>
            </li>
            <li>
              <Link to="/sale" className={getActiveClass("/sale")}>
                <FaShoppingCart className="icon" /> Venta
              </Link>
            </li>
          </>
        )}

        {!isLoggedIn ? (
          <li>
            <Link
              to="/login"
              className={`login-link ${getActiveClass("/login")}`}
            >
              <FaSignInAlt className="icon" /> Iniciar sesión
            </Link>
          </li>
        ) : (
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt className="icon" /> Cerrar sesión
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;