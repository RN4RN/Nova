// backend/src/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js"; // Renombrado de 'connection' a 'db' para mayor claridad
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = "clave_super_secreta_123"; // cámbiala por algo más seguro

// 🟩 REGISTRAR USUARIO
export const registerUser = async (req, res) => {
  try {
    const { username, password, full_name, email, phone_number } = req.body;

    if (!username || !password || !full_name || !email) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si ya existe
    // Antes: await connection.promise().query(...)
    const [existing] = await db.query("SELECT * FROM users WHERE username = ?", [username]); // Corregido

    if (existing.length > 0) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generar UUID para el id
    const userId = uuidv4();

    // Insertar nuevo usuario
    // Antes: await connection.promise().query(...)
    await db.query( // Corregido
      `INSERT INTO users (id, username, password_hash, full_name, email, phone_number, role_id, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 2, 1, NOW())`,
      [userId, username, hashedPassword, full_name, email, phone_number]
    );

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("❌ Error en registro:", error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

// 🟦 LOGIN DE USUARIO
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Antes: await connection.promise().query(...)
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]); // Corregido

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role_id: user.role_id },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Actualizar último login
    // Antes: await connection.promise().query(...)
    await db.query("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id]); // Corregido

    res.json({ message: "Inicio de sesión exitoso", token, user });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};