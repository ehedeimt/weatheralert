const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static("public")); // Archivos estáticos (HTML)

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.post("/api/registro", async (req, res) => {
  const { nombre, apellidos, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO usuarios (nombre, apellidos, email) VALUES ($1, $2, $3) RETURNING *",
      [nombre, apellidos, email]
    );
    res.json({ message: "Usuario registrado", usuario: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
