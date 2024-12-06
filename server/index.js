const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rotas
const colaboradoresRoutes = require('../routes/colaboradores');
const feriasRoutes = require('../routes/ferias');
const faltasRoutes = require('../routes/faltas');

app.use('/api/colaboradores', colaboradoresRoutes);
app.use('/api/ferias', feriasRoutes);
app.use('/api/faltas', faltasRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
