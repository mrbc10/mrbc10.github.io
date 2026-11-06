
const express = require('express');
const app = express();
const PORT = 3000;

const mysql = require('mysql2');
// ===============================
// CONFIGURAÇÕES DO SERVIDOR
// ===============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Disponibiliza os arquivos do projeto
app.use(express.static(__dirname));

const db = mysql.createConnection({host: 'Localhost', 
    user: 'root',
    password: 'ifsp',
    database: 'claveon'
})

db.connect((erro)=>{
    if (erro)(
        console.error(erro)
    )
    else(
        console.log('conectou')
    )
})

// Corrige o endereço antigo da página inicial
app.get('/html/index.html', (req, res) => {
    db.query('SELECT * from obras', (erro, resultado) => {
        if (erro) {
            console.error('Erro ao consultar o banco de dados:', erro);
            return res.status(500).send('Erro interno do servidor.');
        0}
        res.json(resultado);
     })
    res.redirect('/index.html');
});



// ===============================
// VETORES DE ARMAZENAMENTO
// ===============================

// Dados armazenados temporariamente na memória
let usuarios = [];
let instrumentos = [];
let favoritos = [];

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
// SISTEMA DE FAVORITOS
// ===============================

// Adiciona um instrumento aos favoritos
app.post('/api/favoritos', (req, res) => {

    const { emailUsuario, idInstrumento } = req.body;

    if (
        typeof emailUsuario !== 'string' ||
        !emailUsuario.trim() ||
        !Number.isInteger(Number(idInstrumento))
    ) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Informe um usuário e um instrumento válido.'
        });
    }

    const emailNormalizado = emailUsuario.trim().toLowerCase();
    const id = Number(idInstrumento);

    // Verifica se o usuário existe
    const usuarioEncontrado = usuarios.find(usuario =>
        typeof usuario.email === 'string' &&
        usuario.email.trim().toLowerCase() === emailNormalizado
    );

    if (!usuarioEncontrado) {
        return res.status(404).json({
            status: 'erro',
            mensagem: 'Usuário não encontrado.'
        });
    }

    // Verifica se o instrumento existe
    const instrumentoEncontrado = instrumentos.find(
        instrumento => instrumento.id === id
    );

    if (!instrumentoEncontrado) {
        return res.status(404).json({
            status: 'erro',
            mensagem: 'Instrumento não encontrado.'
        });
    }

    // Impede favoritos duplicados
    const jaFavoritado = favoritos.some(favorito =>
        favorito.emailUsuario === emailNormalizado &&
        favorito.idInstrumento === id
    );

    if (jaFavoritado) {
        return res.status(409).json({
            status: 'erro',
            mensagem: 'Este instrumento já está nos seus favoritos.'
        });
    }

    const novoFavorito = {
        emailUsuario: emailNormalizado,
        idInstrumento: id
    };

    favoritos.push(novoFavorito);

    console.log('Novo favorito adicionado!');
    console.log(novoFavorito);

    res.status(201).json({
        status: 'sucesso',
        mensagem: 'Instrumento adicionado aos favoritos!'
    });
});


// Consulta os favoritos de um usuário
app.get('/api/favoritos', (req, res) => {

    const email = req.query.email;

    if (typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Informe o e-mail do usuário.'
        });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const favoritosUsuario = favoritos
        .filter(favorito =>
            favorito.emailUsuario === emailNormalizado
        )
        .map(favorito => {
            return instrumentos.find(
                instrumento => instrumento.id === favorito.idInstrumento
            );
        })
        .filter(instrumento => instrumento !== undefined);

    res.json(favoritosUsuario);
});


// Remove um instrumento dos favoritos
app.delete('/api/favoritos', (req, res) => {

    const { emailUsuario, idInstrumento } = req.body;

    if (
        typeof emailUsuario !== 'string' ||
        !emailUsuario.trim() ||
        !Number.isInteger(Number(idInstrumento))
    ) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Informe um usuário e um instrumento válido.'
        });
    }

    const emailNormalizado = emailUsuario.trim().toLowerCase();
    const id = Number(idInstrumento);

    const indice = favoritos.findIndex(favorito =>
        favorito.emailUsuario === emailNormalizado &&
        favorito.idInstrumento === id
    );

    if (indice === -1) {
        return res.status(404).json({
            status: 'erro',
            mensagem: 'Favorito não encontrado.'
        });
    }

    favoritos.splice(indice, 1);

    console.log('Favorito removido!');

    res.json({
        status: 'sucesso',
        mensagem: 'Instrumento removido dos favoritos!'
    });
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
