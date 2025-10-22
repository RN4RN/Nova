// frontend/src/components/AlertsPanel.jsx
import React, { useEffect, useState } from "react";
import { getAlerts, resolveAlert } from "../services/api";

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState({ auto: [], manual: [] });

  const load = async () => {
    try {
      const res = await getAlerts();
      setAlerts(res);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { load(); }, []);

  const handleResolve = async (id) => {
    if (!window.confirm("Resolver alerta?")) return;
    try {
      await resolveAlert(id);
      load();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="container">
      <h2>Alertas</h2>

      <h3>Automáticas (stock ≤ min_stock)</h3>
      <ul>
        {alerts.auto.map(a => (
          <li key={a.product_id}>
            {a.name} — stock: {a.stock} (min: {a.min_stock})
          </li>
        ))}
      </ul>

      <h3>Manuales</h3>
      <ul>
        {alerts.manual.map(a => (
          <li key={a.id}>
            {a.alert_type} — {a.message} <button onClick={() => handleResolve(a.id)}>Resolver</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertsPanel;
