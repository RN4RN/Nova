// frontend/src/components/PurchaseForm.jsx
import React, { useEffect, useState } from "react";
import apiClient, { createPurchase } from "../services/api";

const PurchaseForm = () => {
  const [products, setProducts] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([{ product_id: "", qty: 1, unit_cost: 0 }]);

  useEffect(() => {
    apiClient.get("/products").then(r => setProducts(r.data)).catch(console.error);
  }, []);

  const addRow = () => setItems([...items, { product_id: "", qty: 1, unit_cost: 0 }]);
  const updateRow = (i, key, value) => { const copy = [...items]; copy[i][key] = value; setItems(copy); };
  const removeRow = (i) => { const copy = [...items]; copy.splice(i,1); setItems(copy); };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createPurchase({ supplier_id: supplierId, items });
      alert("Compra registrada");
      setItems([{ product_id: "", qty: 1, unit_cost: 0 }]);
    } catch (err) { console.error(err); alert("Error creando compra"); }
  };

  return (
    <div className="container">
      <h2>Registrar compra</h2>
      <form onSubmit={submit}>
        <input placeholder="Proveedor (ID)" value={supplierId} onChange={e => setSupplierId(e.target.value)} required />
        <table className="table">
          <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio unit.</th><th></th></tr></thead>
          <tbody>
            {items.map((it,i) => (
              <tr key={i}>
                <td>
                  <select value={it.product_id} onChange={e => updateRow(i,"product_id", e.target.value)} required>
                    <option value="">-- seleccionar --</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </td>
                <td><input type="number" value={it.qty} onChange={e => updateRow(i,"qty", Number(e.target.value))} /></td>
                <td><input type="number" step="0.01" value={it.unit_cost} onChange={e => updateRow(i,"unit_cost", Number(e.target.value))} /></td>
                <td><button type="button" onClick={() => removeRow(i)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={addRow}>Agregar línea</button>
        <button type="submit">Registrar compra</button>
      </form>
    </div>
  );
};

export default PurchaseForm;
