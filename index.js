const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Permite servir arquivos estáticos (HTML, CSS, etc.)
app.use(express.static(__dirname));

// Vetor com os itens (Item 2: adicionado um novo item)
const lista = ['Violão', 'Saxofone', 'Trompete', 'Bateria'];

// Rota GET para enviar o vetor 'lista' ao frontend (Item 1)
app.get('/lista', (req, res) => {
res.json(lista);        
});

// Rota principal para abrir a página inicial
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
console.log(`Servidor rodando em http://localhost:${PORT}`);
});

