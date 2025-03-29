const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public")); // Servir archivos estáticos

// Ruta para registrar usuario
app.post("/api/registro", async (req, res) => {
    const { nombre, apellidos, email } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO usuarios (nombre, apellidos, email) VALUES ($1, $2, $3) RETURNING *",
            [nombre, apellidos, email]
        );
        res.json({ message: "Usuario registrado con éxito", usuario: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
