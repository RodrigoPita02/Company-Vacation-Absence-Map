const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Rota para listar todas as férias (agora incluindo a cor do cargo)
router.get('/', (req, res) => {
    const sql = `
        SELECT ferias.id, funcionarios.nome, ferias.data_inicio, ferias.data_fim, cargos.cor
        FROM ferias 
        JOIN funcionarios ON ferias.funcionario_id = funcionarios.id
        JOIN cargos ON funcionarios.cargo_id = cargos.id
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao buscar férias:", err);
            res.status(500).json({ error: "Erro ao buscar férias" });
        } else {
            res.json(results);  // Agora inclui a cor do cargo
        }
    });
});

// Rota para adicionar novas férias
router.post('/', (req, res) => {
    console.log("Recebendo dados:", req.body);
    const { funcionario_id, data_inicio, data_fim } = req.body;

    if (!funcionario_id || !data_inicio || !data_fim) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const sql = "INSERT INTO ferias (funcionario_id, data_inicio, data_fim) VALUES (?, ?, ?)";
    db.query(sql, [funcionario_id, data_inicio, data_fim], (err, result) => {
        if (err) {
            console.error("Erro ao adicionar férias:", err);
            res.status(500).json({ error: "Erro ao adicionar férias" });
        } else {
            res.status(201).json({ message: "Férias adicionadas com sucesso", id: result.insertId });
        }
    });
});

module.exports = router;
