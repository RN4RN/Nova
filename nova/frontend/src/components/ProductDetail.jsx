// frontend/src/components/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient, { getProductDetail, addBatch } from "../services/api";

const ProductDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState({ product: null, batches: [], movements: [] });
  const [batchForm, setBatchForm] = useState({ lot: "", expires_at: "", stock: 0 });

  const load = async () => {
    try {
      const res = await getProductDetail(id);
      setData(res);
    } catch (err) {
      console.error(err);
      alert("Error cargando producto");
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleBatch = async (e) => {
    e.preventDefault();
    try {
      await addBatch({ product_id: id, ...batchForm });
      setBatchForm({ lot: "", expires_at: "", stock: 0 });
      load();
    } catch (err) {
      console.error(err);
      alert("Error agregando lote");
    }
  };

  if (!data.product) return <div>Cargando...</div>;

  return (
    <div className="container">
      <h2>{data.product.name} — Stock: {data.product.stock}</h2>

      <section>
        <h3>Lotes</h3>
        <table className="table">
          <thead><tr><th>Lot</th><th>Vence</th><th>Stock</th></tr></thead>
          <tbody>
            {data.batches.map(b => (
              <tr key={b.id}><td>{b.lot}</td><td>{b.expires_at}</td><td>{b.stock}</td></tr>
            ))}
          </tbody>
        </table>

        <form onSubmit={handleBatch}>
          <h4>Agregar lote</h4>
          <input name="lot" placeholder="Lote" value={batchForm.lot} onChange={e => setBatchForm({...batchForm, lot: e.target.value})} required />
          <input type="date" name="expires_at" value={batchForm.expires_at} onChange={e => setBatchForm({...batchForm, expires_at: e.target.value})} required />
          <input type="number" name="stock" value={batchForm.stock} onChange={e => setBatchForm({...batchForm, stock: Number(e.target.value)})} />
          <button type="submit">Agregar lote</button>
        </form>
      </section>

      <section>
        <h3>Movimientos recientes</h3>
        <table className="table">
          <thead><tr><th>Tipo</th><th>Cantidad</th><th>Final stock</th><th>Fecha</th><th>Razón</th></tr></thead>
          <tbody>
            {data.movements.map(m => (
              <tr key={m.id}><td>{m.movement_type}</td><td>{m.change_qty}</td><td>{m.final_stock}</td><td>{m.created_at}</td><td>{m.reason}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ProductDetail;
