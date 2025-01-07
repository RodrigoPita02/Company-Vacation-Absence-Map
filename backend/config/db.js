const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mapa_ferias'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado ao MySQL');
});

module.exports = db;
