
const listaInstrumentos = document.getElementById("listaInstrumentos");
const listaProdutos = document.getElementById("listaProdutos");
const secaoProdutos = document.getElementById("secaoProdutos");
const tituloProdutos = document.getElementById("tituloProdutos");
const pesquisa = document.getElementById("pesquisa");
const botaoVoltar = document.getElementById("voltarInstrumentos");

const categoriaAtual = document.body.dataset.categoria;
let instrumentosCarregados = [];

// Imagem padrão quando o cadastro não informa uma imagem
const imagemPadrao = "../Imanges/teste.png";

function criarImagem(src, alt) {
    const imagem = document.createElement("img");
    imagem.src = src || imagemPadrao;
    imagem.alt = alt;
    imagem.onerror = function () {
        imagem.onerror = null;
        imagem.src = imagemPadrao;
    };
    return imagem;
}

function mostrarEstado(container, mensagem) {
    container.replaceChildren();

    const texto = document.createElement("p");
    texto.className = "estado-catalogo";
    texto.textContent = mensagem;

    container.appendChild(texto);
}

// Carrega os instrumentos da categoria desta página
async function carregarInstrumentos() {
    mostrarEstado(listaInstrumentos, "Carregando instrumentos...");

    try {
        const resposta = await fetch("/api/instrumentos");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os instrumentos.");
        }

        const dados = await resposta.json();

        instrumentosCarregados = dados.filter(instrumento =>
            (instrumento.categoria || "").toLowerCase() ===
            categoriaAtual.toLowerCase()
        );

        exibirInstrumentos(instrumentosCarregados);

    } catch (erro) {
        console.error(erro);
        mostrarEstado(
            listaInstrumentos,
            "Não foi possível carregar os instrumentos. Verifique se o servidor está funcionando."
        );
    }
}

// Mostra os cartões dos instrumentos
function exibirInstrumentos(lista) {
    listaInstrumentos.replaceChildren();

    if (lista.length === 0) {
        mostrarEstado(
            listaInstrumentos,
            "Nenhum instrumento cadastrado nesta categoria."
        );
        return;
    }

    lista.forEach(instrumento => {
        const card = document.createElement("div");
        card.className = "card";

        const imagem = criarImagem(
            instrumento.imagem,
            instrumento.nome
        );

        const info = document.createElement("div");
        info.className = "info";

        const marca = document.createElement("span");
        marca.className = "marca";
        marca.textContent = instrumento.categoria;

        const nome = document.createElement("h2");
        nome.textContent = instrumento.nome;

        const descricao = document.createElement("p");
        descricao.textContent = instrumento.descricao || "";

        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "btn";
        botao.textContent = "Ver produtos";

        botao.addEventListener("click", () => {
            carregarProdutos(instrumento);
        });

        info.append(marca, nome);

        if (instrumento.descricao) {
            info.appendChild(descricao);
        }

        info.appendChild(botao);
        card.append(imagem, info);
        listaInstrumentos.appendChild(card);
    });
}

// Busca somente os produtos do instrumento selecionado
async function carregarProdutos(instrumento) {
    secaoProdutos.hidden = false;
    tituloProdutos.textContent =
        "Produtos disponíveis: " + instrumento.nome;

    mostrarEstado(listaProdutos, "Carregando produtos...");

    secaoProdutos.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    try {
        const resposta = await fetch(
            "/api/produtos?instrumentoId=" +
            encodeURIComponent(instrumento.id)
        );

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os produtos.");
        }

        const produtos = await resposta.json();

        exibirProdutos(produtos);

    } catch (erro) {
        console.error(erro);
        mostrarEstado(listaProdutos, "Erro ao carregar os produtos.");
    }
}

// Mostra os produtos do instrumento escolhido
function exibirProdutos(produtos) {
    listaProdutos.replaceChildren();

    if (produtos.length === 0) {
        mostrarEstado(
            listaProdutos,
            "Ainda não há produtos cadastrados para este instrumento."
        );
        return;
    }

    produtos.forEach(produto => {
        const card = document.createElement("div");
        card.className = "card";

        const imagem = criarImagem(produto.imagem, produto.nome);

        const info = document.createElement("div");
        info.className = "info";

        const nome = document.createElement("h2");
        nome.textContent = produto.nome;

        const descricao = document.createElement("p");
        descricao.textContent = produto.descricao || "";

        const preco = document.createElement("p");
        preco.className = "preco";
        preco.textContent = Number(produto.preco).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

        info.append(nome);

        if (produto.descricao) {
            info.appendChild(descricao);
        }

        info.appendChild(preco);
        card.append(imagem, info);
        listaProdutos.appendChild(card);
    });
}

// Pesquisa instrumentos pelo nome
pesquisa.addEventListener("input", () => {
    const termo = pesquisa.value.trim().toLowerCase();

    const filtrados = instrumentosCarregados.filter(instrumento =>
        instrumento.nome.toLowerCase().includes(termo)
    );

    exibirInstrumentos(filtrados);
});

// Volta para a lista de instrumentos
botaoVoltar.addEventListener("click", () => {
    secaoProdutos.hidden = true;

    document.querySelector(".titulo").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

// Inicia o catálogo
carregarInstrumentos();
    