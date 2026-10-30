
const express = require('express');
const app = express();
const PORT = 3000;

// ===============================
// CONFIGURAÇÕES DO SERVIDOR
// ===============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Disponibiliza os arquivos do projeto
app.use(express.static(__dirname));

// Corrige o endereço antigo da página inicial
app.get('/html/index.html', (req, res) => {
    res.redirect('/index.html');
});


// ===============================
// VETORES DE ARMAZENAMENTO
// ===============================

// Dados armazenados temporariamente na memória
let usuarios = [];
let instrumentos = [];

// Lista de obras de arte
let lista = [
    {
        titulo: "Obra de arte 1",
        descricao: "Fictícia",
        imagem: "https://placeholder.com",
        linkImagem: "Imagem Fictícia 1"
    },
    {
        titulo: "Obra de arte 2",
        descricao: "Fictícia",
        imagem: "https://placeholder.com",
        linkImagem: "Imagem Fictícia 2"
    }
];

// Contador de IDs dos instrumentos
let proximoInstrumentoId = 1;


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

// Retorna os usuários sem as senhas
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

    const {
        emailUsuario,
        nome,
        descricao,
        imagem
    } = req.body;

    // Verifica os campos obrigatórios
    if (
        typeof emailUsuario !== 'string' ||
        typeof nome !== 'string' ||
        !emailUsuario.trim() ||
        !nome.trim()
    ) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Informe o e-mail e o nome do instrumento.'
        });
    }

    // Normaliza o e-mail
    const emailNormalizado = emailUsuario.trim().toLowerCase();

    // Procura o usuário pelo e-mail cadastrado
    const usuarioEncontrado = usuarios.find(usuario =>
        typeof usuario.email === 'string' &&
        usuario.email.trim().toLowerCase() === emailNormalizado
    );

    // Impede o cadastro caso o usuário não exista
    if (!usuarioEncontrado) {
        return res.status(404).json({
            status: 'erro',
            mensagem: 'E-mail não encontrado. Cadastre-se antes de cadastrar um instrumento.'
        });
    }

    // Cria o instrumento associado ao usuário
    const novoInstrumento = {
        id: proximoInstrumentoId++,
        nome: nome.trim(),
        descricao: typeof descricao === 'string' ? descricao.trim() : '',
        imagem: typeof imagem === 'string' ? imagem.trim() : '',

        // Informações de quem realizou o cadastro
        usuario: {
            nome: usuarioEncontrado.nome,
            email: usuarioEncontrado.email
        }
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

// Retorna todos os instrumentos
app.get('/api/instrumentos', (req, res) => {
    res.json(instrumentos);
});


// ===============================
// LISTA DE OBRAS DE ARTE
// ===============================

app.get('/api/lista', (req, res) => {
    res.json(lista);
});

app.post('/api/lista', (req, res) => {

    const novaObra = req.body;

    if (!novaObra || Object.keys(novaObra).length === 0) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Nenhuma obra foi enviada.'
        });
    }

    lista.push(novaObra);

    console.log('Nova obra de arte cadastrada!');
    console.log(novaObra);

    res.status(201).json({
        status: 'sucesso',
        mensagem: 'Obra cadastrada com sucesso!'
    });
});


// ===============================
// INICIALIZAÇÃO DO SERVIDOR
// ===============================

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
