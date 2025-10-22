// backend/src/controllers/salesController.js
import pool from '../config/db.js';
import { v4 as uuidv4 } from 'uuid'; // Para generar números de factura/boleta únicos

export const createSale = async (req, res) => {
  // Asegúrate de que req.user esté disponible desde authMiddleware
  const userId = req.user ? req.user.id : null; // Asume que authMiddleware adjunta el ID del usuario
  if (!userId) {
    return res.status(401).json({ message: "Usuario no autenticado para realizar la venta." });
  }

  const {
    customer_id, // Puede ser null
    document_type,
    payment_method,
    subtotal,
    discount_amount, // Asumimos 0 por ahora
    total,
    items, // Array de { product_id, qty, unit_price }
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "La venta debe contener al menos un producto." });
  }

  if (document_type === "Factura" && !customer_id) {
      return res.status(400).json({ message: "Para una Factura, el cliente es obligatorio." });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Generar número de documento único (ej. BOLETA-UUID, FACT-UUID)
    const prefix = document_type.substring(0, Math.min(document_type.length, 4)).toUpperCase();
    const invoice_number = `${prefix}-${uuidv4().substring(0, 8).toUpperCase()}`;

    // 2. Insertar la venta en la tabla 'sales'
    const [saleResult] = await connection.query(
      `INSERT INTO sales (invoice_number, document_type, user_id, customer_id, subtotal, discount_amount, total, payment_method, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Completed')`, // Status por defecto
      [invoice_number, document_type, userId, customer_id, subtotal, discount_amount, total, payment_method]
    );
    const saleId = saleResult.insertId;

    // 3. Iterar sobre los ítems del carrito
    for (const item of items) {
      const { product_id, qty, unit_price } = item;

      // 3.1. Verificar el stock actual del producto
      const [productRows] = await connection.query(
        `SELECT stock, name, min_stock FROM products WHERE id = ? FOR UPDATE`, // Bloquea la fila
        [product_id]
      );

      if (productRows.length === 0) {
        throw new Error(`Producto con ID ${product_id} no encontrado.`);
      }

      const currentStock = productRows[0].stock;
      const productName = productRows[0].name;
      const productMinStock = productRows[0].min_stock;

      if (currentStock < qty) {
        throw new Error(`Stock insuficiente para el producto '${productName}'. Stock disponible: ${currentStock}, solicitado: ${qty}.`);
      }

      // 3.2. Insertar el detalle de la venta en 'sale_items'
      await connection.query(
        `INSERT INTO sale_items (sale_id, product_id, qty, unit_price)
         VALUES (?, ?, ?, ?)`,
        [saleId, product_id, qty, unit_price]
      );

      // 3.3. Actualizar el stock del producto
      const newStock = currentStock - qty;
      await connection.query(
        `UPDATE products SET stock = ? WHERE id = ?`,
        [newStock, product_id]
      );

      // 3.4. Registrar el movimiento de stock
      await connection.query(
        `INSERT INTO stock_movements (product_id, movement_type, change_qty, final_stock, reason, reference_id, reference_table, user_id)
         VALUES (?, 'Sale', ?, ?, 'Venta realizada', ?, 'sales', ?)`,
        [product_id, -qty, newStock, saleId, userId]
      );

      // Opcional: Verificar si el nuevo stock está por debajo del min_stock y generar una alerta
      if (newStock <= productMinStock) {
        const [existingAlert] = await connection.query(
          `SELECT id FROM alerts WHERE product_id = ? AND alert_type = 'Low Stock' AND active = 1`,
          [product_id]
        );
        if (existingAlert.length === 0) {
          await connection.query(
            `INSERT INTO alerts (product_id, alert_type, message, threshold_value, active)
             VALUES (?, 'Low Stock', ?, ?, 1)`,
            [product_id, `El stock de ${productName} ha caído por debajo del mínimo. Stock actual: ${newStock}.`, productMinStock]
          );
        }
      }
    }

    await connection.commit();
    res.status(201).json({ message: "Venta realizada con éxito.", saleId, invoice_number });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error al crear la venta:", error.message);
    res.status(500).json({ message: error.message || "Error interno del servidor al procesar la venta." });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Función para obtener el historial de ventas
export const getSalesHistory = async (req, res) => {
  try {
    const [sales] = await pool.query(
      `SELECT
          s.id,
          s.invoice_number,
          s.document_type,
          s.total,
          s.payment_method,
          s.status,
          s.created_at,
          u.username AS user_name,
          c.full_name AS customer_name,
          c.document_number AS customer_document
       FROM sales s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN customers c ON s.customer_id = c.id
       ORDER BY s.created_at DESC`
    );

    // Obtener los ítems para cada venta
    for (let sale of sales) {
      const [items] = await pool.query(
        `SELECT si.product_id, p.name AS product_name, si.qty, si.unit_price
         FROM sale_items si
         JOIN products p ON si.product_id = p.id
         WHERE si.sale_id = ?`,
        [sale.id]
      );
      sale.items = items;
    }

    res.json(sales);
  } catch (error) {
    console.error("Error al obtener historial de ventas:", error);
    res.status(500).json({ message: "Error interno del servidor al obtener historial de ventas." });
  }
};