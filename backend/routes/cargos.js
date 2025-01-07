const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Certifique-se de que o caminho está correto

// 🟢 Rota para listar todos os cargos
router.get('/', (req, res) => {
    const sql = "SELECT id, nome, cor FROM cargos";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Erro ao buscar cargos:", err);
            res.status(500).json({ error: "Erro ao buscar cargos" });
        } else {
            res.json(result);
        }
    });
});

module.exports = router;
