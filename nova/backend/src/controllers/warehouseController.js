// backend/src/controllers/warehouseController.js
import connection from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// GET product detail with batches & movements
export const getProductDetail = (req, res) => {
  const { id } = req.params;
  const sqlProduct = "SELECT * FROM products WHERE id = ?";
  const sqlBatches = "SELECT * FROM product_batches WHERE product_id = ? ORDER BY expires_at ASC";
  const sqlMovements = "SELECT * FROM stock_movements WHERE product_id = ? ORDER BY created_at DESC LIMIT 50";

  connection.query(sqlProduct, [id], (err, prodRows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (prodRows.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
    const product = prodRows[0];
    connection.query(sqlBatches, [id], (err2, batches) => {
      if (err2) return res.status(500).json({ error: err2.message });
      connection.query(sqlMovements, [id], (err3, movements) => {
        if (err3) return res.status(500).json({ error: err3.message });
        res.json({ product, batches, movements });
      });
    });
  });
};

// POST add batch (and update product stock)
export const addBatch = (req, res) => {
  const userId = req.user?.id || null;
  const { product_id, lot, expires_at, stock } = req.body;
  if (!product_id || !lot || !expires_at) return res.status(400).json({ error: "Datos incompletos" });

  // Insert batch
  const sql = `INSERT INTO product_batches (product_id, lot, expires_at, stock, created_at) VALUES (?, ?, ?, ?, NOW())`;
  connection.query(sql, [product_id, lot, expires_at, stock || 0], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    // Update product stock (sum)
    const updateProduct = `UPDATE products SET stock = stock + ? WHERE id = ?`;
    connection.query(updateProduct, [stock || 0, product_id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });

      // Insert stock movement
      const movSql = `INSERT INTO stock_movements (product_id, batch_id, movement_type, change_qty, final_stock, reason, reference_id, reference_table, user_id, created_at)
                      VALUES (?, ?, 'purchase_in', ?, (SELECT stock FROM products WHERE id=?), ?, ?, 'product_batches', ?, NOW())`;
      connection.query(movSql, [product_id, result.insertId, stock || 0, product_id, `Ingreso lote ${lot}`, result.insertId, userId], (err3) => {
        if (err3) console.error("Warning movement:", err3);
        res.json({ message: "Lote agregado y stock actualizado", batchId: result.insertId });
      });
    });
  });
};

// POST register purchase (creates purchase + items, updates batches or products stock)
export const createPurchase = (req, res) => {
  const userId = req.user?.id || null;
  const { supplier_id, invoice_number, items } = req.body;
  // items: [{ product_id, unit_cost, qty, batch_id (optional) , lot, expires_at }]
  if (!supplier_id || !items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: "Datos incompletos" });

  const total = items.reduce((s, it) => s + (parseFloat(it.unit_cost || 0) * parseInt(it.qty || 0)), 0);

  const sqlPurchase = `INSERT INTO purchases (supplier_id, invoice_number, total, user_id, created_at) VALUES (?, ?, ?, ?, NOW())`;
  connection.query(sqlPurchase, [supplier_id, invoice_number || null, total, userId], (err, pRes) => {
    if (err) return res.status(500).json({ error: err.message });
    const purchaseId = pRes.insertId;

    // Insert items sequentially
    const insertItem = (item, cb) => {
      const sqlItem = `INSERT INTO purchase_items (purchase_id, product_id, batch_id, qty, unit_cost, subtotal) VALUES (?, ?, ?, ?, ?, ?)`;
      const subtotal = parseFloat(item.unit_cost || 0) * parseInt(item.qty || 0);
      connection.query(sqlItem, [purchaseId, item.product_id, item.batch_id || null, item.qty, item.unit_cost, subtotal], (err2, itemRes) => {
        if (err2) return cb(err2);
        // If batch_id given, increase batch stock; else create batch if lot provided, else just update product stock
        const qty = item.qty || 0;
        if (item.batch_id) {
          connection.query(`UPDATE product_batches SET stock = stock + ? WHERE id = ?`, [qty, item.batch_id], (e) => {
            if (e) console.error(e);
            connection.query(`UPDATE products SET stock = stock + ? WHERE id = ?`, [qty, item.product_id], () => {
              // stock movement
              const movSql = `INSERT INTO stock_movements (product_id, batch_id, movement_type, change_qty, final_stock, reason, reference_id, reference_table, user_id, created_at)
                              VALUES (?, ?, 'purchase_in', ?, (SELECT stock FROM products WHERE id=?), ?, ?, 'purchases', ?, NOW())`;
              connection.query(movSql, [item.product_id, item.batch_id, qty, item.product_id, `Compra #${purchaseId}`, purchaseId, userId], () => cb(null));
            });
          });
        } else if (item.lot) {
          // create new batch
          connection.query(`INSERT INTO product_batches (product_id, lot, expires_at, stock, created_at) VALUES (?, ?, ?, ?, NOW())`, [item.product_id, item.lot, item.expires_at || null, qty], (e, newBatch) => {
            if (e) return cb(e);
            const newBatchId = newBatch.insertId;
            connection.query(`UPDATE products SET stock = stock + ? WHERE id = ?`, [qty, item.product_id], () => {
              const movSql = `INSERT INTO stock_movements (product_id, batch_id, movement_type, change_qty, final_stock, reason, reference_id, reference_table, user_id, created_at)
                              VALUES (?, ?, 'purchase_in', ?, (SELECT stock FROM products WHERE id=?), ?, ?, 'purchases', ?, NOW())`;
              connection.query(movSql, [item.product_id, newBatchId, qty, item.product_id, `Compra #${purchaseId}`, purchaseId, userId], () => cb(null));
            });
          });
        } else {
          // no batch info -> just update product stock
          connection.query(`UPDATE products SET stock = stock + ? WHERE id = ?`, [qty, item.product_id], () => {
            const movSql = `INSERT INTO stock_movements (product_id, movement_type, change_qty, final_stock, reason, reference_id, reference_table, user_id, created_at)
                            VALUES (?, 'purchase_in', ?, (SELECT stock FROM products WHERE id=?), ?, ?, 'purchases', ?, NOW())`;
            connection.query(movSql, [item.product_id, qty, item.product_id, `Compra #${purchaseId}`, purchaseId, userId], () => cb(null));
          });
        }
      });
    };

    // iterate items sequentially
    const tasks = items.slice();
    const next = () => {
      if (tasks.length === 0) return res.json({ message: "Compra registrada", purchaseId });
      const it = tasks.shift();
      insertItem(it, (errItem) => {
        if (errItem) return res.status(500).json({ error: errItem.message });
        next();
      });
    };
    next();
  });
};

// POST stock adjustment (in/out)
export const adjustStock = (req, res) => {
  const userId = req.user?.id || null;
  const { product_id, batch_id, movement_type, qty, reason } = req.body;
  if (!product_id || !movement_type || !qty) return res.status(400).json({ error: "Datos incompletos" });
  // movement_type: adjustment_in | adjustment_out
  const changeQty = parseInt(qty, 10) * (movement_type === "adjustment_out" ? -1 : 1);
  // Update product stock
  const updateProduct = `UPDATE products SET stock = stock + ? WHERE id = ?`;
  connection.query(updateProduct, [changeQty, product_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    // Update batch if provided
    const updateBatch = batch_id ? `UPDATE product_batches SET stock = stock + ? WHERE id = ?` : null;
    if (updateBatch) {
      connection.query(updateBatch, [changeQty, batch_id], (e) => {
        if (e) console.error(e);
        // Insert movement
        const movSql = `INSERT INTO stock_movements (product_id, batch_id, movement_type, change_qty, final_stock, reason, reference_id, reference_table, user_id, created_at)
                        VALUES (?, ?, ?, ?, (SELECT stock FROM products WHERE id=?), ?, NULL, NULL, ?, NOW())`;
        connection.query(movSql, [product_id, batch_id || null, movement_type, changeQty, product_id, reason || null, userId], (err2) => {
          if (err2) console.error(err2);
          res.json({ message: "Stock ajustado correctamente" });
        });
      });
    } else {
      const movSql = `INSERT INTO stock_movements (product_id, movement_type, change_qty, final_stock, reason, user_id, created_at)
                      VALUES (?, ?, ?, (SELECT stock FROM products WHERE id=?), ?, ?, NOW())`;
      connection.query(movSql, [product_id, movement_type, changeQty, product_id, reason || null, userId], (err2) => {
        if (err2) console.error(err2);
        res.json({ message: "Stock ajustado correctamente" });
      });
    }
  });
};

// GET alerts (products under min_stock or manual alerts)
export const getAlerts = (req, res) => {
  // combine auto alerts (stock <= min_stock) + alerts table active
  const sqlAuto = "SELECT p.id AS product_id, p.name, p.stock, p.min_stock, 'low_stock' AS alert_type FROM products p WHERE p.stock <= p.min_stock";
  const sqlManual = "SELECT a.* FROM alerts a WHERE a.active = 1 ORDER BY a.created_at DESC";
  connection.query(sqlAuto, (err, autoRows) => {
    if (err) return res.status(500).json({ error: err.message });
    connection.query(sqlManual, (err2, manualRows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ auto: autoRows, manual: manualRows });
    });
  });
};

// POST resolve alert
export const resolveAlert = (req, res) => {
  const userId = req.user?.id || null;
  const { id } = req.params; // alert id
  const sql = `UPDATE alerts SET active = 0, resolved_at = NOW(), resolved_by_user_id = ? WHERE id = ?`;
  connection.query(sql, [userId, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Alerta resuelta" });
  });
};
