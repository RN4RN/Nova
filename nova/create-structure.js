// 🏗️ create-structure.js
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import chalk from "chalk";

// Definir estructura base
const structure = [
  "backend/src/config",
  "backend/src/routes",
  "backend/src/controllers",
  "backend/src/models",
  "frontend"
];

// Crear carpetas
structure.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(chalk.green(`📁 Carpeta creada: ${dir}`));
  }
});

// Archivos base
const files = {
  "backend/src/app.js": `import express from "express";
import cors from "cors";
import productsRoutes from "./routes/products.js";
import connection from "./config/db.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/products", productsRoutes);

connection.connect(err => {
  if (err) {
    console.error("❌ Error al conectar con MySQL:", err.message);
  } else {
    app.listen(3000, () => 
      console.log("✅ Servidor backend corriendo en http://localhost:3000")
    );
  }
});
`,

  "backend/src/config/db.js": `import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "inventario"
});

export default connection;
`,

  "backend/src/models/productsModel.js": `import db from "../config/db.js";

export const getAllProducts = (callback) => {
  db.query("SELECT * FROM products", callback);
};

export const addProduct = (data, callback) => {
  db.query("INSERT INTO products SET ?", data, callback);
};

export const deleteProduct = (id, callback) => {
  db.query("DELETE FROM products WHERE id = ?", [id], callback);
};
`,

  "backend/src/controllers/productsController.js": `import { getAllProducts, addProduct, deleteProduct } from "../models/productsModel.js";

export const listarProductos = (req, res) => {
  getAllProducts((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

export const agregarProducto = (req, res) => {
  const data = req.body;
  addProduct(data, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "✅ Producto agregado correctamente" });
  });
};

export const eliminarProducto = (req, res) => {
  const { id } = req.params;
  deleteProduct(id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "🗑️ Producto eliminado correctamente" });
  });
};
`,

  "backend/src/routes/products.js": `import express from "express";
import { listarProductos, agregarProducto, eliminarProducto } from "../controllers/productsController.js";

const router = express.Router();
router.get("/", listarProductos);
router.post("/", agregarProducto);
router.delete("/:id", eliminarProducto);

export default router;
`,

  "frontend/index.html": `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inventario</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>📦 Sistema de Inventario</h1>
  <div class="container">
    <input type="text" id="nombre" placeholder="Nombre del producto" />
    <input type="number" id="precio" placeholder="Precio (S/)" />
    <button onclick="agregar()">➕ Agregar</button>
    <ul id="lista"></ul>
  </div>
  <script src="script.js"></script>
</body>
</html>
`,

  "frontend/script.js": `const API = "http://localhost:3000/api/products";

async function listar() {
  const res = await fetch(API);
  const data = await res.json();
  document.getElementById("lista").innerHTML = data.map(p => 
    \`<li><strong>\${p.name}</strong> - S/ \${p.unit_price}
     <button onclick="eliminar(\${p.id})">🗑️</button></li>\`
  ).join("");
}

async function agregar() {
  const name = document.getElementById("nombre").value;
  const unit_price = document.getElementById("precio").value;
  if (!name || !unit_price) return alert("⚠️ Completa todos los campos");
  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, unit_price })
  });
  listar();
  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
}

async function eliminar(id) {
  await fetch(\`\${API}/\${id}\`, { method: "DELETE" });
  listar();
}

listar();
`,

  "frontend/style.css": `body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8f9fa;
  color: #333;
  text-align: center;
  margin: 0;
  padding: 40px;
}
h1 {
  color: #2e8b57;
  margin-bottom: 20px;
}
.container {
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  display: inline-block;
}
input {
  margin: 5px;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
button {
  background-color: #2e8b57;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #267046;
}
ul {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}
li {
  margin: 8px 0;
  padding: 8px;
  background: #f1f1f1;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
}
`
};

// Crear archivos
Object.entries(files).forEach(([file, content]) => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(chalk.blue(`📝 Archivo creado: ${file}`));
  }
});

// Crear package.json automático
const pkg = {
  name: "inventario-node",
  version: "1.0.0",
  type: "module",
  scripts: {
    start: "node src/app.js",
    dev: "nodemon src/app.js"
  },
  dependencies: {
    express: "^4.21.1",
    cors: "^2.8.5",
    mysql2: "^3.10.0"
  },
  devDependencies: {
    nodemon: "^3.1.0",
    chalk: "^5.3.0"
  }
};

fs.writeFileSync("backend/package.json", JSON.stringify(pkg, null, 2));
console.log(chalk.yellow("📦 package.json generado automáticamente."));

// Instalar dependencias
console.log(chalk.cyan("\n⚙️ Instalando dependencias en backend..."));
execSync("cd backend && npm install", { stdio: "inherit" });

console.log(chalk.greenBright("\n✅ Proyecto creado con éxito."));
console.log(chalk.whiteBright(`
👉 Ejecuta los siguientes pasos:
1️⃣ Inicia MySQL y crea la base de datos: inventario
2️⃣ Crea la tabla:

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  unit_price DECIMAL(10,2)
);

3️⃣ Ejecuta:
   cd backend
   npm run dev
4️⃣ Abre el archivo frontend/index.html en tu navegador 🌐
`));
