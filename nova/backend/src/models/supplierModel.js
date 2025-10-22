// backend/src/models/supplierModel.js
import db from '../config/db.js'; // Usa import y añade la extensión .js

const supplierModel = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM suppliers ORDER BY name ASC');
    return rows;
  },
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM suppliers WHERE id = ?', [id]);
    return rows[0];
  },
  create: async (supplier) => {
    const { name, contact_person, phone, email, address } = supplier;
    const [result] = await db.query(
      'INSERT INTO suppliers (name, contact_person, phone, email, address) VALUES (?, ?, ?, ?, ?)',
      [name, contact_person, phone, email, address]
    );
    return { id: result.insertId, ...supplier };
  },
  update: async (id, supplier) => {
    const { name, contact_person, phone, email, address } = supplier;
    const [result] = await db.query(
      'UPDATE suppliers SET name = ?, contact_person = ?, phone = ?, email = ?, address = ? WHERE id = ?',
      [name, contact_person, phone, email, address, id]
    );
    return result.affectedRows;
  },
  remove: async (id) => {
    const [result] = await db.query('DELETE FROM suppliers WHERE id = ?', [id]);
    return result.affectedRows;
  },
};

export default supplierModel; // Cambia a export default