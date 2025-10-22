// frontend/src/components/StockAdjust.jsx
import React, { useState, useEffect } from "react";
import apiClient, { adjustStock } from "../services/api";

const StockAdjust = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ product_id: "", batch_id: "", movement_type: "adjustment_in", qty: 0, reason: "" });

  useEffect(() => {
    apiClient.get("/products").then(r => setProducts(r.data)).catch(console.error);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await adjustStock(form);
      alert("Ajuste realizado");
      setForm({ product_id: "", batch_id: "", movement_type: "adjustment_in", qty: 0, reason: "" });
    } catch (err) { console.error(err); alert("Error"); }
  };

  return (
    <div className="container">
      <h2>Ajuste de stock</h2>
      <form onSubmit={submit}>
        <select value={form.product_id} onChange={e => setForm({...form, product_id: e.target.value})} required>
          <option value="">Selecciona producto</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={form.movement_type} onChange={e => setForm({...form, movement_type: e.target.value})}>
          <option value="adjustment_in">Ajuste IN</option>
          <option value="adjustment_out">Ajuste OUT</option>
        </select>
        <input type="number" value={form.qty} onChange={e => setForm({...form, qty: Number(e.target.value)})} />
        <input placeholder="Razón" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} />
        <button type="submit">Aplicar</button>
      </form>
    </div>
  );
};

export default StockAdjust;
