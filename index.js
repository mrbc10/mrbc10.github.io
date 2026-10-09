
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Dados armazenados temporariamente na memória
let usuarios = [];
let instrumentos = [];
let produtos = [];

let proximoInstrumentoId = 1;
let proximoProdutoId = 1;

// ===============================
// CADASTRO DE USUÁRIOS
// ===============================

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

// ===============================
// CADASTRO DE INSTRUMENTOS
// ===============================

app.post('/api/instrumentos', (req, res) => {
    const { nome, descricao, categoria, imagem } = req.body;

    if (!nome || !categoria) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Informe o nome e a categoria do instrumento.'
        });
    }

    const novoInstrumento = {
        id: proximoInstrumentoId++,
        nome,
        descricao: descricao || '',
        categoria,
        imagem: imagem || ''
    };

    instrumentos.push(novoInstrumento);

    console.log('Novo instrumento cadastrado!');
    console.log(novoInstrumento);

    res.status(201).json({
        status: 'sucesso',
        mensagem: 'Instrumento cadastrado com sucesso!',
        instrumento: novoInstrumento
    });
});

app.get('/api/instrumentos', (req, res) => {
    res.json(instrumentos);
});

// ===============================
// CADASTRO DE PRODUTOS
// ===============================

app.post('/api/produtos', (req, res) => {
    const { nome, descricao, preco, imagem, instrumentoId } = req.body;

    if (!nome || preco === undefined || preco === '' || !instrumentoId) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Preencha o nome, o preço e o instrumento relacionado.'
        });
    }

    const instrumento = instrumentos.find(
        item => item.id === Number(instrumentoId)
    );

    if (!instrumento) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'O instrumento selecionado não existe.'
        });
    }

    const precoNumerico = Number(preco);

    if (!Number.isFinite(precoNumerico) || precoNumerico < 0) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Informe um preço válido.'
        });
    }

    const novoProduto = {
        id: proximoProdutoId++,
        nome,
        descricao: descricao || '',
        preco: precoNumerico,
        imagem: imagem || '',
        instrumentoId: instrumento.id
    };

    produtos.push(novoProduto);

    console.log('Novo produto cadastrado!');
    console.log({
        ...novoProduto,
        instrumento: instrumento.nome
    });

    res.status(201).json({
        status: 'sucesso',
        mensagem: 'Produto cadastrado com sucesso!',
        produto: novoProduto
    });
});

// Lista todos os produtos ou filtra pelo instrumento
app.get('/api/produtos', (req, res) => {
    const { instrumentoId } = req.query;

    if (instrumentoId !== undefined) {
        const instrumento = instrumentos.find(
            item => item.id === Number(instrumentoId)
        );

        if (!instrumento) {
            return res.status(404).json({
                mensagem: 'Instrumento não encontrado.'
            });
        }

        return res.json(
            produtos.filter(
                produto => produto.instrumentoId === instrumento.id
            )
        );
    }

    res.json(produtos);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
