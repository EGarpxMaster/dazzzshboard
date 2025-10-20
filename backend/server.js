const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "dazzzshboard",
    port: process.env.DB_PORT || 3306
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error("Error conectando a MySQL:", err);
        return;
    }
    console.log("Conexión exitosa a MySQL");
});

// Endpoint para obtener todos los datos
app.get("/api/datos", (req, res) => {
    db.query("SELECT * FROM datos ORDER BY id", (err, results) => {
        if (err) {
            console.error("Error en la consulta:", err);
            res.status(500).json({ error: "Error al obtener datos" });
            return;
        }
        res.json(results);
    });
});

// Endpoint para obtener un dato específico
app.get("/api/datos/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM datos WHERE id = ?", [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: "Error al obtener el dato" });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: "Dato no encontrado" });
            return;
        }
        res.json(results[0]);
    });
});

// Endpoint para crear un nuevo dato
app.post("/api/datos", (req, res) => {
    const { nombre, valor } = req.body;
    db.query(
        "INSERT INTO datos (nombre, valor) VALUES (?, ?)",
        [nombre, valor],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: "Error al crear el dato" });
                return;
            }
            res.status(201).json({
                id: result.insertId,
                nombre,
                valor,
                message: "Dato creado exitosamente"
            });
        }
    );
});

// Endpoint para actualizar un dato
app.put("/api/datos/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, valor } = req.body;
    db.query(
        "UPDATE datos SET nombre = ?, valor = ? WHERE id = ?",
        [nombre, valor, id],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: "Error al actualizar el dato" });
                return;
            }
            if (result.affectedRows === 0) {
                res.status(404).json({ error: "Dato no encontrado" });
                return;
            }
            res.json({ message: "Dato actualizado exitosamente" });
        }
    );
});

// Endpoint para eliminar un dato
app.delete("/api/datos/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM datos WHERE id = ?", [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: "Error al eliminar el dato" });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Dato no encontrado" });
            return;
        }
        res.json({ message: "Dato eliminado exitosamente" });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});