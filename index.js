
const express = require('express');
const app = express();
const PORT = 3000;

// Permite receber dados em JSON
app.use(express.json());

// Permite receber dados de formulários
app.use(express.urlencoded({ extended: true }));

// Disponibiliza os arquivos do projeto
app.use(express.static(__dirname));

// Listas temporárias
let usuarios = [];
let instrumentos = [];


// ===========================
// CADASTRO DE USUÁRIOS
// ===========================

app.post('/api/cadastro', (req, res) => {
    const novoUsuario = req.body;

    if (!novoUsuario || Object.keys(novoUsuario).length === 0) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Nenhum dado foi enviado.'
        });
    }

    usuarios.push(novoUsuario);

    const { senha, confirmarSenha, ...dadosSeguros } = novoUsuario;

    console.log('Novo cadastro recebido!');
    console.log(dadosSeguros);

    res.status(201).json({
        status: 'sucesso',
        mensagem: 'Cadastro recebido com sucesso!'
    });
});

app.get('/api/cadastro', (req, res) => {
    const dadosSeguros = usuarios.map(
        ({ senha, confirmarSenha, ...dados }) => dados
    );

    res.json(dadosSeguros);
});


// ===========================
// CADASTRO DE INSTRUMENTOS
// ===========================

// Recebe um novo instrumento
app.post('/api/lista', (req, res) => {
    const novaObra = req.body;

    if (
        !novaObra ||
        !novaObra.t ||
        !novaObra.desc ||
        !novaObra.img ||
        !novaObra.alt
    ) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Preencha todos os campos do instrumento.'
        });
    }

    instrumentos.push(novaObra);

    console.log('Novo instrumento cadastrado!');
    console.log(novaObra);
    console.log('Total de instrumentos:', instrumentos.length);

    res.status(201).json({
        status: 'sucesso',
        mensagem: 'Instrumento cadastrado com sucesso!'
    });
});

// Consulta os instrumentos cadastrados
app.get('/api/lista', (req, res) => {
    res.json(instrumentos);
});


// ===========================
// INICIAR SERVIDOR
// ===========================

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
