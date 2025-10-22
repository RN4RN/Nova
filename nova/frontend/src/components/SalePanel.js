// frontend/src/pages/SalePanel.js
import React, { useState, useEffect } from "react";
import api from "../services/api"; // Asegúrate de que esta ruta sea correcta
import { useNavigate } from "react-router-dom";
import "../App.css"; // Asegúrate de importar tus estilos globales
import './SalePanel.css'; // ¡Importa el nuevo archivo CSS aquí!
const SalePanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [foundProducts, setFoundProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [foundCustomers, setFoundCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [documentType, setDocumentType] = useState("Boleta"); // 'Boleta', 'Factura', 'Ticket'
  const [error, setError] = useState(""); // Nuevo estado para manejar errores
  const [loadingProducts, setLoadingProducts] = useState(false); // Estado para indicar carga de productos
  const [loadingCustomers, setLoadingCustomers] = useState(false); // Estado para indicar carga de clientes
  const navigate = useNavigate();

  // --- Búsqueda de Productos ---
  useEffect(() => {
    setError(""); // Limpiar errores previos al iniciar una nueva búsqueda
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length >= 2) { // Mínimo 2 caracteres para buscar
        searchProducts();
      } else {
        setFoundProducts([]); // Limpiar resultados si el término es muy corto
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const searchProducts = async () => {
    setLoadingProducts(true); // Iniciar carga
    try {
      // console.log("Frontend: Buscando productos con término:", searchTerm);
      const res = await api.get(`/products/search?term=${searchTerm}`);
      setFoundProducts(res.data);
      // console.log("Frontend: Productos encontrados:", res.data);
    } catch (error) {
      console.error("❌ Error buscando productos:", error);
      // Extraer el mensaje de error del backend si está disponible
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Error desconocido al buscar productos. Asegúrate de que el backend esté corriendo y autenticado.";
      setError(`❌ ${errorMessage}`);
      setFoundProducts([]);
    } finally {
      setLoadingProducts(false); // Finalizar carga
    }
  };

  const addProductToCart = (productToAdd) => {
    setError(""); // Limpiar errores al intentar añadir un producto
    const existingItem = cart.find((item) => item.id === productToAdd.id);

    if (existingItem) {
      // Si ya está en el carrito, intenta incrementar la cantidad
      if (existingItem.qty < productToAdd.stock) {
        updateCartItemQty(productToAdd.id, existingItem.qty + 1);
      } else {
        setError(`No hay más stock disponible para ${productToAdd.name}. Stock actual: ${productToAdd.stock}`);
      }
    } else {
      // Si no está, añádelo con cantidad 1
      if (productToAdd.stock > 0) {
        setCart([...cart, { 
          ...productToAdd, 
          qty: 1, 
          originalStock: productToAdd.stock, // Almacena el stock actual del producto como su límite
          min_stock: productToAdd.min_stock // Guarda el min_stock para referencia
        }]);
      } else {
        setError(`¡Producto "${productToAdd.name}" sin stock disponible!`);
      }
    }
    setSearchTerm(""); // Limpiar búsqueda después de añadir
    setFoundProducts([]); // Limpiar resultados de búsqueda
  };

  const updateCartItemQty = (productId, newQty) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === productId) {
          const quantity = Math.max(1, newQty);
          // Asegúrate de no exceder el stock original del producto (que es el stock actual al momento de añadirlo)
          if (quantity > item.originalStock) {
            setError(`No se puede exceder el stock disponible de ${item.name} (${item.originalStock}).`);
            return { ...item, qty: item.originalStock }; // Limitar a originalStock
          }
          setError(""); // Limpiar error si la cantidad es válida
          return { ...item, qty: quantity };
        }
        return item;
      })
    );
  };

  const removeProductFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
    setError(""); // Limpiar cualquier error al remover un producto
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.qty * item.unit_price, 0).toFixed(2);
  };

  // --- Búsqueda de Clientes ---
  useEffect(() => {
    setError(""); // Limpiar errores previos
    const delayDebounceFn = setTimeout(() => {
      if (customerSearchTerm.length >= 3) { // Mínimo 3 caracteres para buscar clientes
        searchCustomers();
      } else {
        setFoundCustomers([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [customerSearchTerm]);

  const searchCustomers = async () => {
    setLoadingCustomers(true); // Iniciar carga de clientes
    try {
      // console.log("Frontend: Buscando clientes con término:", customerSearchTerm);
      const res = await api.get(`/customers/search?term=${customerSearchTerm}`);
      setFoundCustomers(res.data);
      // console.log("Frontend: Clientes encontrados:", res.data);
    } catch (error) {
      console.error("❌ Error buscando clientes:", error);
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Error desconocido al buscar clientes. Inténtalo de nuevo.";
      setError(`❌ ${errorMessage}`);
      setFoundCustomers([]);
    } finally {
      setLoadingCustomers(false); // Finalizar carga de clientes
    }
  };

  const selectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerSearchTerm("");
    setFoundCustomers([]);
    setError(""); // Limpiar errores
  };

  const clearCustomer = () => {
    setSelectedCustomer(null);
    setError(""); // Limpiar errores
  };

  // --- Finalizar Venta ---
  const finalizeSale = async () => {
    setError(""); // Limpiar errores previos

    if (cart.length === 0) {
      setError("El carrito está vacío. Añade productos para realizar la venta.");
      return;
    }

    // Validación específica para Factura: requiere cliente
    if (documentType === "Factura" && !selectedCustomer) {
      setError("Para emitir una Factura, debes seleccionar un cliente.");
      return;
    }

    if (!window.confirm(`¿Confirmar venta por un total de S/ ${calculateTotal()}?`)) {
      return;
    }

    try {
      const totalCalculated = parseFloat(calculateTotal());
      const subtotalCalculated = totalCalculated; // Asumiendo no hay descuentos en el frontend para el subtotal

      const saleData = {
        customer_id: selectedCustomer ? selectedCustomer.id : null, // Es null si no se selecciona cliente
        document_type: documentType,
        payment_method: paymentMethod,
        subtotal: subtotalCalculated,
        discount_amount: 0, // Por ahora 0
        total: totalCalculated,
        items: cart.map(item => ({
          product_id: item.id,
          qty: item.qty,
          unit_price: item.unit_price,
          // Si manejas lotes, podrías añadir batch_id aquí
        })),
      };

      const res = await api.post("/sales", saleData);
      alert(`✅ Venta realizada con éxito! Documento: ${res.data.invoice_number}`);
      
      // Resetear el estado después de una venta exitosa
      setCart([]);
      setSelectedCustomer(null);
      setSearchTerm("");
      setFoundProducts([]);
      setCustomerSearchTerm("");
      setFoundCustomers([]);
      // Podrías navegar a una página de confirmación o de historial de ventas
      navigate("/sales-history"); 

    } catch (error) {
      console.error("❌ Error al finalizar la venta:", error.response ? error.response.data : error.message);
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Error desconocido al finalizar la venta.";
      setError(`❌ ${errorMessage}`);
    }
  };

  return (
    <div id="sale-panel-container">
      <h2 id="sale-panel-title">🛒 Panel de Ventas</h2>

      {/* Mostrar errores globales */}
      {error && <div className="error-message">{error}</div>}

      {/* Sección de Búsqueda de Productos */}
      <div id="product-search-section">
        <input
          id="product-search-input"
          type="text"
          placeholder="Buscar producto por nombre, SKU o código de barras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loadingProducts && searchTerm.length >= 2 && <p className="loading-message">Cargando productos...</p>} {/* Indicador de carga */}
        {foundProducts.length > 0 && (
          <ul id="product-search-results">
            {foundProducts.map((p) => (
              <li key={p.id} onClick={() => addProductToCart(p)}>
                {p.name} (Stock: {p.stock}, S/ {p.unit_price.toFixed(2)})
                {p.stock <= p.min_stock && p.stock > 0 && <span className="low-stock-warning"> (Stock bajo)</span>}
                {p.stock === 0 && <span className="no-stock-warning"> (Sin Stock)</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Sección de Carrito */}
      <div id="cart-section">
        <h3 id="cart-title">Productos en Carrito</h3>
        {cart.length === 0 ? (
          <p id="empty-cart-message">El carrito está vacío.</p>
        ) : (
          <table id="cart-table">
            <thead id="cart-table-header">
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="cart-table-body">
              {cart.map((item) => (
                <tr key={item.id} className="cart-item-row">
                  <td className="cart-item-name">{item.name}</td>
                  <td className="cart-item-price">S/ {item.unit_price.toFixed(2)}</td>
                  <td className="cart-item-qty">
                    <input
                      type="number"
                      min="1"
                      max={item.originalStock} // El máximo es el stock que tenía cuando se añadió
                      value={item.qty}
                      onChange={(e) => updateCartItemQty(item.id, parseInt(e.target.value))}
                      className="cart-qty-input"
                    />
                    {item.qty > item.originalStock && (
                        <p className="qty-error">Máximo {item.originalStock}</p>
                    )}
                  </td>
                  <td className="cart-item-subtotal">
                    S/ {(item.qty * item.unit_price).toFixed(2)}
                  </td>
                  <td className="cart-item-actions">
                    <button
                      className="remove-from-cart-btn"
                      onClick={() => removeProductFromCart(item.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div id="cart-total">
          <strong>Total:</strong> <span id="cart-total-amount">S/ {calculateTotal()}</span>
        </div>
      </div>

      {/* Sección de Cliente */}
      <div id="customer-section">
        <h3 id="customer-section-title">Cliente</h3>
        {selectedCustomer ? (
          <div id="selected-customer-info">
            <p>Cliente: <strong>{selectedCustomer.full_name}</strong></p>
            <p>DNI/RUC: {selectedCustomer.document_number}</p>
            <button id="clear-customer-btn" onClick={clearCustomer}>Cambiar Cliente</button>
          </div>
        ) : (
          <>
            <input
              id="customer-search-input"
              type="text"
              placeholder="Buscar cliente por nombre o DNI..."
              value={customerSearchTerm}
              onChange={(e) => setCustomerSearchTerm(e.target.value)}
            />
            {loadingCustomers && customerSearchTerm.length >= 3 && <p className="loading-message">Cargando clientes...</p>} {/* Indicador de carga */}
            {foundCustomers.length > 0 && (
              <ul id="customer-search-results">
                {foundCustomers.map((c) => (
                  <li key={c.id} onClick={() => selectCustomer(c)}>
                    {c.full_name} ({c.document_number})
                  </li>
                ))}
              </ul>
            )}
            {documentType === "Factura" && !selectedCustomer && <p className="warning-message">⚠ Para Factura es necesario un cliente.</p>}
          </>
        )}
      </div>

      {/* Sección de Pago y Finalizar */}
      <div id="payment-and-finalize-section">
        <div className="form-group">
          <label htmlFor="document-type-select">Tipo de Documento:</label>
          <select
            id="document-type-select"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
          >
            <option value="Boleta">Boleta</option>
            <option value="Factura">Factura</option>
            <option value="Ticket">Ticket</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="payment-method-select">Método de Pago:</label>
          <select
            id="payment-method-select"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta</option>
            <option value="Transferencia">Transferencia</option>
          </select>
        </div>

        <button id="finalize-sale-btn" onClick={finalizeSale}>
          💰 Finalizar Venta (S/ {calculateTotal()})
        </button>
      </div>
    </div>
  );
};

export default SalePanel;