
/* ===============================
   MODAL DE CONTATO
================================ */

function abrirContato() {
    const modal = document.getElementById("modalContato");

    if (modal) {
        modal.style.display = "flex";
    }
}

function fecharContato() {
    const modal = document.getElementById("modalContato");

    if (modal) {
        modal.style.display = "none";
    }
}

window.addEventListener("click", function (event) {
    const modal = document.getElementById("modalContato");

    if (modal && event.target === modal) {
        fecharContato();
    }
});

document.addEventListener("keydown", function (event) {
    const modal = document.getElementById("modalContato");

    if (event.key === "Escape" && modal &&
        modal.style.display === "flex") {
        fecharContato();
    }
});


/* ===============================
   FUNÇÕES AUXILIARES
================================ */

function mostrarMensagem(elemento, texto, tipo) {
    if (!elemento) return;

    elemento.textContent = texto;
    elemento.classList.remove("sucesso", "erro");

    if (tipo) {
        elemento.classList.add(tipo);
    }
}


/* ===============================
   CADASTRO DE INSTRUMENTOS
================================ */

const formInstrumento = document.getElementById("formInstrumento");

if (formInstrumento) {
    formInstrumento.addEventListener("submit", async function (event) {
        event.preventDefault();

        const mensagem = document.getElementById("mensagemInstrumento");
        const botao = formInstrumento.querySelector('button[type="submit"]');

        const instrumento = {
            nome: document.getElementById("nomeInstrumento").value.trim(),
            categoria: document.getElementById("categoriaInstrumento").value,
            descricao: document.getElementById("descricaoInstrumento").value.trim(),
            imagem: document.getElementById("imagemInstrumento").value.trim()
        };

        if (!instrumento.nome || !instrumento.categoria) {
            mostrarMensagem(
                mensagem,
                "Preencha o nome e a categoria do instrumento.",
                "erro"
            );
            return;
        }

        botao.disabled = true;
        mostrarMensagem(mensagem, "Cadastrando instrumento...", "");

        try {
            const resposta = await fetch("/api/instrumentos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(instrumento)
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    resultado.mensagem || "Não foi possível cadastrar o instrumento."
                );
            }

            formInstrumento.reset();

            mostrarMensagem(
                mensagem,
                "Instrumento cadastrado com sucesso!",
                "sucesso"
            );

            console.log("Instrumento cadastrado:", resultado.instrumento);

        } catch (erro) {
            mostrarMensagem(mensagem, erro.message, "erro");
            console.error("Erro ao cadastrar instrumento:", erro);
        } finally {
            botao.disabled = false;
        }
    });
}


/* ===============================
   CARREGAR INSTRUMENTOS NO FORMULÁRIO DE PRODUTOS
================================ */

async function carregarInstrumentos() {
    const select = document.getElementById("instrumentoId");

    if (!select) return;

    select.innerHTML = '<option value="">Carregando instrumentos...</option>';

    try {
        const resposta = await fetch("/api/instrumentos");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os instrumentos.");
        }

        const instrumentos = await resposta.json();

        select.innerHTML = "";

        const opcaoInicial = document.createElement("option");
        opcaoInicial.value = "";
        opcaoInicial.textContent = "Selecione um instrumento";
        select.appendChild(opcaoInicial);

        instrumentos.forEach(function (instrumento) {
            const opcao = document.createElement("option");
            opcao.value = instrumento.id;
            opcao.textContent =
                `${instrumento.nome} — ${instrumento.categoria}`;

            select.appendChild(opcao);
        });

        if (instrumentos.length === 0) {
            opcaoInicial.textContent = "Cadastre um instrumento primeiro";
        }

    } catch (erro) {
        select.innerHTML = '<option value="">Erro ao carregar instrumentos</option>';
        console.error("Erro ao carregar instrumentos:", erro);
    }
}

carregarInstrumentos();


/* ===============================
   CADASTRO DE PRODUTOS
================================ */

const formProduto = document.getElementById("formProduto");

if (formProduto) {
    formProduto.addEventListener("submit", async function (event) {
        event.preventDefault();

        const mensagem = document.getElementById("mensagemProduto");
        const botao = document.getElementById("botaoProduto");

        const produto = {
            nome: document.getElementById("nomeProduto").value.trim(),
            instrumentoId: document.getElementById("instrumentoId").value,
            descricao: document.getElementById("descricaoProduto").value.trim(),
            preco: document.getElementById("precoProduto").value,
            imagem: document.getElementById("imagemProduto").value.trim()
        };

        if (!produto.nome || !produto.instrumentoId ||
            produto.preco === "") {
            mostrarMensagem(
                mensagem,
                "Preencha o nome, o instrumento e o preço.",
                "erro"
            );
            return;
        }

        botao.disabled = true;
        mostrarMensagem(mensagem, "Cadastrando produto...", "");

        try {
            const resposta = await fetch("/api/produtos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(produto)
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    resultado.mensagem || "Não foi possível cadastrar o produto."
                );
            }

            formProduto.reset();

            mostrarMensagem(
                mensagem,
                "Produto cadastrado com sucesso!",
                "sucesso"
            );

            console.log("Produto cadastrado:", resultado.produto);

            await carregarInstrumentos();

        } catch (erro) {
            mostrarMensagem(mensagem, erro.message, "erro");
            console.error("Erro ao cadastrar produto:", erro);
        } finally {
            botao.disabled = false;
        }
    });
}
