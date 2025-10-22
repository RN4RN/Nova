// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Home2 from "./components/Home2";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import Login from "./components/Login";
import Register from "./components/Register";
import SalePanel from "./components/SalePanel";
import ProductDetail from "./components/ProductDetail"; // Si lo usas para ver detalles individuales
import PurchaseForm from "./components/PurchaseForm";
import AlertsPanel from "./components/AlertsPanel";
import StockAdjust from "./components/StockAdjust";
import CategoryForm from "./components/CategoryForm"; // ¡Importa el nuevo componente!
import SupplierForm from './components/SupplierForm';
import CategoryProductsPage from './components/CategoryProductsPage';
import './App.css';

const ConditionalHome = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Home2 /> : <Home />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<ConditionalHome />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/add" element={<ProductForm />} /> {/* Para agregar */}
            <Route path="/products/edit/:id" element={<ProductForm />} /> {/* ¡NUEVA RUTA para editar! */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/sale" element={<SalePanel />} />
            <Route path="/products/:id" element={<ProductDetail />} /> {/* Para ver detalles del producto */}
            <Route path="/purchases/new" element={<PurchaseForm />} />
            <Route path="/alerts" element={<AlertsPanel />} />
            <Route path="/stock/adjust" element={<StockAdjust />} />
            <Route path="/categories" element={<CategoryForm />} /> {/* ¡NUEVA RUTA para categorías! */}
            <Route path="/suppliers/new" element={<SupplierForm />} />
            <Route path="/category/:categoryId/:categoryName" element={<CategoryProductsPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;