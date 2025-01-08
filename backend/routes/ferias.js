const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Rota para listar todas as férias (com filtros de funcionário e mês)
router.get('/', (req, res) => {
    const { funcionario_id, mes } = req.query;  // Obtém os parâmetros de filtro

    let sql = `
        SELECT ferias.id, funcionarios.nome, ferias.data_inicio, ferias.data_fim, cargos.cor
        FROM ferias 
        JOIN funcionarios ON ferias.funcionario_id = funcionarios.id
        JOIN cargos ON funcionarios.cargo_id = cargos.id
        WHERE 1=1
    `;
    
    // Aplica o filtro de funcionário, se fornecido
    if (funcionario_id) {
        sql += ` AND ferias.funcionario_id = ?`;
    }

    // Aplica o filtro de mês, se fornecido
    if (mes) {
        sql += ` AND MONTH(ferias.data_inicio) = ?`;
    }

    // Executa a consulta com os filtros
    db.query(sql, [funcionario_id, mes].filter(Boolean), (err, results) => {
        if (err) {
            console.error("Erro ao buscar férias:", err);
            return res.status(500).json({ error: "Erro ao buscar férias" });
        }
        res.json(results);  // Retorna os resultados filtrados
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
            return res.status(500).json({ error: "Erro ao adicionar férias" });
        }
        res.status(201).json({ message: "Férias adicionadas com sucesso", id: result.insertId });
    });
});

// Rota para buscar férias por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT ferias.id, funcionarios.nome, ferias.data_inicio, ferias.data_fim, cargos.cor
        FROM ferias
        JOIN funcionarios ON ferias.funcionario_id = funcionarios.id
        JOIN cargos ON funcionarios.cargo_id = cargos.id
        WHERE ferias.id = ?
    `;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Erro ao buscar férias:", err);
            return res.status(500).json({ error: "Erro ao buscar férias" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Férias não encontradas" });
        }
        res.json(result[0]);  // Retorna a falta encontrada com os dados completos
    });
});

// Rota para atualizar férias
router.put('/:id', (req, res) => {
    const { funcionario_id, data_inicio, data_fim } = req.body;
    const { id } = req.params;

    if (!funcionario_id || !data_inicio || !data_fim) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const sql = `
        UPDATE ferias 
        SET funcionario_id = ?, data_inicio = ?, data_fim = ? 
        WHERE id = ?
    `;
    db.query(sql, [funcionario_id, data_inicio, data_fim, id], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar férias:", err);
            return res.status(500).json({ error: "Erro ao atualizar férias" });
        }
        res.json({ message: "Férias atualizadas com sucesso!" });
    });
});

// Rota para excluir férias
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM ferias WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Erro ao excluir férias:", err);
            return res.status(500).json({ error: "Erro ao excluir férias" });
        }
        res.json({ message: "Férias excluídas com sucesso!" });
    });
});

module.exports = router;