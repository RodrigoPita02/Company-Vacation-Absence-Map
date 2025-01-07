const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🟢 Rota para listar funcionários com seus cargos
router.get('/', (req, res) => {
    const sql = `
        SELECT funcionarios.id, funcionarios.nome, cargos.nome AS cargo, cargos.cor
        FROM funcionarios
        LEFT JOIN cargos ON funcionarios.cargo_id = cargos.id
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao buscar funcionários:", err);
            res.status(500).json({ error: "Erro ao buscar funcionários" });
        } else {
            res.json(results);
        }
    });
});

// 🟢 Rota para adicionar um funcionário
router.post('/', (req, res) => {
    const { nome, cargo_id } = req.body;

    if (!nome || !cargo_id) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const sql = "INSERT INTO funcionarios (nome, cargo_id) VALUES (?, ?)";
    db.query(sql, [nome, cargo_id], (err, result) => {
        if (err) {
            console.error("Erro ao adicionar funcionário:", err);
            res.status(500).json({ error: "Erro ao adicionar funcionário" });
        } else {
            res.status(201).json({ message: "Funcionário adicionado com sucesso", id: result.insertId });
        }
    });
});

// 🟢 Atualizar funcionário
router.put('/:id', (req, res) => {
    const { nome, cargo_id } = req.body;
    const { id } = req.params;

    if (!nome || !cargo_id) {
        return res.status(400).json({ error: "Nome e cargo são obrigatórios" });
    }

    const sql = "UPDATE funcionarios SET nome = ?, cargo_id = ? WHERE id = ?";
    db.query(sql, [nome, cargo_id, id], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar funcionário:", err);
            res.status(500).json({ error: "Erro ao atualizar funcionário" });
        } else {
            res.json({ message: "Funcionário atualizado com sucesso" });
        }
    });
});

// 🟢 Rota para excluir um funcionário
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM funcionarios WHERE id = ?";
    db.query(sql, [id], (err) => {
        if (err) {
            console.error("Erro ao excluir funcionário:", err);
            res.status(500).json({ error: "Erro ao excluir funcionário" });
        } else {
            res.json({ message: "Funcionário excluído com sucesso" });
        }
    });
});

// 🟢 Rota para listar cargos
router.get('/cargos', (req, res) => {
    const sql = "SELECT * FROM cargos";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao buscar cargos:", err);
            res.status(500).json({ error: "Erro ao buscar cargos" });
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
