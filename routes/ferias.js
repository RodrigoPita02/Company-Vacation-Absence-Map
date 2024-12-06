const express = require('express');
const router = express.Router();
const db = require('../models/database');

router.get('/', (req, res) => {
    db.query('SELECT * FROM ferias', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { id_colaborador, data_inicio, data_fim } = req.body;
    db.query('INSERT INTO ferias SET ?', { id_colaborador, data_inicio, data_fim }, (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

module.exports = router;
