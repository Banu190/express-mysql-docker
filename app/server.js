
const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 3000;

app.use(express.json());

// Подключение к MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || "db",
    user: process.env.DB_USER || "appuser",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "shopdb",
    waitForConnections: true,
    connectionLimit: 10
});

// Главная страница
app.get("/", (req, res) => {
    res.json({
        message: "Express.js + MySQL работает!",
        endpoints: [
            "GET /products",
            "GET /products/:id",
            "POST /products",
            "PUT /products/:id",
            "DELETE /products/:id"
        ]
    });
});

// CREATE - добавить товар
app.post("/products", async (req, res) => {
    try {
        const { name, price } = req.body;

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof price !== "number" ||
            !Number.isFinite(price) ||
            price < 0
        ) {
            return res.status(400).json({
                error: "Укажите название и корректную цену"
            });
        }

        const [result] = await pool.execute(
            "INSERT INTO products (name, price) VALUES (?, ?)",
            [name.trim(), price]
        );

        res.status(201).json({
            message: "Товар добавлен",
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ - получить все товары
app.get("/products", async (req, res) => {
    try {
        const [rows] = await pool.execute(
            "SELECT * FROM products ORDER BY id"
        );

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ - получить один товар
app.get("/products/:id", async (req, res) => {
    try {
        const [rows] = await pool.execute(
            "SELECT * FROM products WHERE id = ?",
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "Товар не найден"
            });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE - изменить товар
app.put("/products/:id", async (req, res) => {
    try {
        const { name, price } = req.body;

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof price !== "number" ||
            !Number.isFinite(price) ||
            price < 0
        ) {
            return res.status(400).json({
                error: "Укажите название и корректную цену"
            });
        }

        const [result] = await pool.execute(
            "UPDATE products SET name = ?, price = ? WHERE id = ?",
            [name.trim(), price, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Товар не найден"
            });
        }

        res.json({ message: "Товар обновлён" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - удалить товар
app.delete("/products/:id", async (req, res) => {
    try {
        const [result] = await pool.execute(
            "DELETE FROM products WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Товар не найден"
            });
        }

        res.json({ message: "Товар удалён" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Запуск сервера
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
