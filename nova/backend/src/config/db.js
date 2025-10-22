// backend/src/config/db.js
import mysql from "mysql2/promise"; // <--- CAMBIADO A mysql2/promise

// 🧠 Configuración de AlwaysData
const dbConfig = {
  host: "mysql-rncorp.alwaysdata.net", // 🔹 host de AlwaysData
  user: "rncorp_usuario",                      // 🔹 tu usuario de AlwaysData (verifícalo en tu panel)
  password: "Ro123ger.",           // 🔹 la contraseña que pusiste al crear la base
  database: "rncorp_botica",           // 🔹 tu base de datos en AlwaysData
  port: 3306,                          // 🔹 normalmente es 3306
};

// 🧱 Crear un pool de conexiones para mejor manejo de promesas y reconexiones
// con mysql2/promise, se recomienda un pool en lugar de una única conexión
const pool = mysql.createPool(dbConfig); // <--- Usamos createPool

// Probar la conexión al iniciar el pool
pool.getConnection()
  .then(connection => {
    console.log("🟢 Conectado a la base de datos MySQL en AlwaysData (rncorp_botica)");
    connection.release(); // Libera la conexión de vuelta al pool
  })
  .catch(err => {
    console.error("❌ Error al conectar con MySQL (AlwaysData):", err.message);
    process.exit(1); // Sale de la aplicación si no puede conectar a la DB
  });

// Exporta el pool para que otros módulos puedan usarlo para hacer consultas
export default pool;