const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // Para servir arquivos estáticos do frontend
const funcionariosRoutes = require('./routes/funcionarios');
const feriasRoutes = require('./routes/ferias');
const cargosRoutes = require('./routes/cargos'); 
const faltasRouter = require('./routes/faltas'); 

const app = express();

// Middleware para permitir CORS e parser de JSON
app.use(cors());
app.use(bodyParser.json());

// Rotas para os funcionários e férias
app.use('/funcionarios', funcionariosRoutes);
app.use('/ferias', feriasRoutes);
app.use('/cargos', cargosRoutes); 
app.use('/faltas', faltasRouter); 

// Servir o frontend estático (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Rota padrão para retornar o arquivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
