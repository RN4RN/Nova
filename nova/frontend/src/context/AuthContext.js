// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

// 1. Crea el contexto
const AuthContext = createContext();

// 2. Crea un hook personalizado para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);

// 3. Crea el proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Opcional: para guardar datos del usuario
  const navigate = useNavigate(); // Inicializa useNavigate aquí

  // Efecto para verificar el token al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // Aquí podrías hacer una validación del token si es necesario
      // O decodificarlo para obtener datos básicos del usuario
      setIsLoggedIn(true);
      // setUser(decodeToken(token)); // Ejemplo: si tienes una función para decodificar JWT
    }
  }, []); // Se ejecuta solo una vez al montar el componente

  // Función para iniciar sesión
  const login = (token) => {
    localStorage.setItem("authToken", token);
    setIsLoggedIn(true);
    // Opcional: Cargar datos del usuario
    // setUser(decodeToken(token));
    navigate("/"); // Redirige a la página de inicio
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setUser(null); // Limpia los datos del usuario
    navigate("/login"); // Redirige a la página de inicio de sesión
  };

  // El valor que se proveerá a todos los componentes hijos
  const authContextValue = {
    isLoggedIn,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};