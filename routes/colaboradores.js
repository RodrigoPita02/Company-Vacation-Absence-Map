const express = require('express');
const router = express.Router();
const db = require('../models/database');

router.get('/', (req, res) => {
    db.query('SELECT * FROM colaboradores', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

module.exports = router;
