const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config(); // Para cargar variables de entorno

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Configuración de la conexión a la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // La URL de conexión de la base de datos
  ssl: {
    rejectUnauthorized: false,
  },
});

// Ruta para registrar usuarios
app.post("/api/registro", async (req, res) => {
  const { nombre, apellidos, email } = req.body;
  
  // Verificar que se recibieron los datos correctamente
  if (!nombre || !apellidos || !email) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }
  
  try {
    const result = await pool.query(
      "INSERT INTO usuarios (nombre, apellidos, email) VALUES ($1, $2, $3) RETURNING *",
      [nombre, apellidos, email]
    );
    
    res.json({
      message: "Usuario registrado con éxito",
      usuario: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Configuración del puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
