// backend/src/controllers/customerController.js
import pool from '../config/db.js'; // Asegúrate de que esta ruta sea correcta

export const searchCustomers = async (req, res) => {
  const { term } = req.query; // 'term' es lo que el frontend envía para buscar

  if (!term || term.length < 3) {
    return res.status(400).json({ message: "El término de búsqueda de cliente debe tener al menos 3 caracteres." });
  }

  try {
    // Busca por nombre completo (o parte) o por número de documento
    const [rows] = await pool.query(
      `SELECT id, full_name, document_number, address, phone, email
       FROM customers
       WHERE full_name LIKE ? OR document_number LIKE ?`,
      [`%${term}%`, `%${term}%`]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al buscar clientes:", error);
    res.status(500).json({ message: "Error interno del servidor al buscar clientes." });
  }
};

// Opcional: Podrías añadir una función para obtener un cliente por ID si lo necesitas en el futuro
export const getCustomerById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT id, full_name, document_number, address, phone, email
       FROM customers
       WHERE id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener cliente por ID:", error);
    res.status(500).json({ message: "Error interno del servidor al obtener cliente." });
  }
};