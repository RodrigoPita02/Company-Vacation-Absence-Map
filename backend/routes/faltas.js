const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Rota para listar todas as faltas
router.get('/', (req, res) => {
    const sql = `
        SELECT faltas.id, funcionarios.nome, faltas.data_falta, faltas.data_fim, faltas.motivo, faltas.cor
        FROM faltas
        JOIN funcionarios ON faltas.funcionario_id = funcionarios.id
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao buscar faltas:", err);
            res.status(500).json({ error: "Erro ao buscar faltas" });
        } else {
            console.log("Faltas retornadas do banco de dados:", results);
            res.json(results);  // Retorna as faltas para o frontend
        }
    });
});

// Rota para buscar uma falta específica pelo ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    console.log("Recebendo requisição para falta com ID:", id); // Log do ID recebido

    const sql = `
        SELECT faltas.id, funcionarios.nome, faltas.data_falta, faltas.data_fim, faltas.motivo, cargos.cor
        FROM faltas
        JOIN funcionarios ON faltas.funcionario_id = funcionarios.id
        JOIN cargos ON funcionarios.cargo_id = cargos.id
        WHERE faltas.id = ?
    `;
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Erro ao buscar falta:", err);
            return res.status(500).json({ error: "Erro ao buscar falta" });
        }

        if (results.length === 0) {
            console.log("Falta não encontrada para ID:", id);
            return res.status(404).json({ error: "Falta não encontrada" });
        }

        res.json(results[0]); // Retorna a falta encontrada
    });
});

// Rota para adicionar novas faltas
router.post('/', (req, res) => {
    console.log("Recebendo dados:", req.body);
    const { funcionario_id, data_falta, data_fim, motivo } = req.body;

    // Verifica se os campos obrigatórios estão presentes
    if (!funcionario_id || !data_falta || !motivo) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios: funcionário_id, data_falta e motivo" });
    }

    // Verifica se data_fim foi fornecida, caso contrário, usa data_falta
    const data_fim_valida = data_fim || data_falta; // Se não passar data_fim, usa data_falta

    // Obter a cor do cargo do funcionário
    const sqlCargo = `SELECT cargos.cor FROM funcionarios JOIN cargos ON funcionarios.cargo_id = cargos.id WHERE funcionarios.id = ?`;
    db.query(sqlCargo, [funcionario_id], (err, result) => {
        if (err) {
            console.error("Erro ao obter cor do cargo:", err);
            return res.status(500).json({ error: "Erro ao obter cor do cargo" });
        }
        const cor = result[0] ? result[0].cor : '#808080'; // Se não encontrar cor, usa cinza

        console.log("Cor do cargo:", cor);  // Adicionando log para verificar a cor do cargo

        // SQL para adicionar a falta no banco de dados
        const sql = "INSERT INTO faltas (funcionario_id, data_falta, data_fim, motivo, cor) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, [funcionario_id, data_falta, data_fim_valida, motivo, cor], (err, result) => {
            if (err) {
                console.error("Erro ao adicionar falta:", err);
                return res.status(500).json({ error: "Erro ao adicionar falta" });
            } else {
                console.log("Falta registrada com sucesso:", result);  // Adicionando log para o resultado
                res.status(201).json({ message: "Falta registrada com sucesso", id: result.insertId });
            }
        });
    });
});

// Rota para atualizar uma falta existente
router.put('/:id', (req, res) => {
    const { funcionario_id, data_falta, data_fim, motivo } = req.body;
    const { id } = req.params;

    if (!funcionario_id || !data_falta || !motivo) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    // Verifica se data_fim foi fornecida, caso contrário, usa data_falta
    const data_fim_valida = data_fim || data_falta; // Se não passar data_fim, usa data_falta

    // Obter a cor do cargo do funcionário
    const sqlCargo = `SELECT cargos.cor FROM funcionarios JOIN cargos ON funcionarios.cargo_id = cargos.id WHERE funcionarios.id = ?`;
    db.query(sqlCargo, [funcionario_id], (err, result) => {
        if (err) {
            console.error("Erro ao obter cor do cargo:", err);
            return res.status(500).json({ error: "Erro ao obter cor do cargo" });
        }
        const cor = result[0] ? result[0].cor : '#808080'; // Se não encontrar cor, usa cinza

        console.log("Cor do cargo:", cor);

        const sql = `
            UPDATE faltas
            SET funcionario_id = ?, data_falta = ?, data_fim = ?, motivo = ?, cor = ?
            WHERE id = ?
        `;
        db.query(sql, [funcionario_id, data_falta, data_fim_valida, motivo, cor, id], (err, result) => {
            if (err) {
                console.error("Erro ao atualizar falta:", err);
                return res.status(500).json({ error: "Erro ao atualizar falta" });
            } else {
                res.json({ message: "Falta atualizada com sucesso" });
            }
        });
    });
});

// Rota para excluir uma falta
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM faltas WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Erro ao excluir falta:", err);
            return res.status(500).json({ error: "Erro ao excluir falta" });
        } else {
            res.json({ message: "Falta excluída com sucesso" });
        }
    });
});

module.exports = router;
