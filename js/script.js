
 // ===============================
 // MODAL DE CONTATO
 // ===============================

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

// Fechar clicando fora do modal
window.addEventListener("click", function (event) {
    const modal = document.getElementById("modalContato");

    if (modal && event.target === modal) {
        fecharContato();
    }
});

// Fechar pressionando ESC
document.addEventListener("keydown", function (event) {
    const modal = document.getElementById("modalContato");

    if (event.key === "Escape" && modal &&
        modal.style.display === "flex") {
        fecharContato();
    }
});


// ===============================
// FUNÇÕES AUXILIARES
// ===============================

// Exibe mensagens de sucesso ou erro
function mostrarMensagem(elemento, texto, tipo) {

    if (!elemento) return;

    elemento.textContent = texto;

    elemento.classList.remove("sucesso", "erro");

    if (tipo) {
        elemento.classList.add(tipo);
    }
}

// Converte a resposta do servidor em JSON
async function obterResultado(resposta) {

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(
            resultado.mensagem || "Ocorreu um erro na solicitação."
        );
    }

    return resultado;
}


// ===============================
// CADASTRO DE INSTRUMENTOS
// ===============================

const formInstrumento = document.getElementById("formInstrumento");

if (formInstrumento) {

    formInstrumento.addEventListener("submit", async function (event) {

        event.preventDefault();

        const mensagem = document.getElementById("mensagemInstrumento");

        const botao = formInstrumento.querySelector(
            'button[type="submit"]'
        );

        const instrumento = {
            emailUsuario: document.getElementById("emailUsuarioInstrumento").value.trim(),

            nome: document.getElementById("nomeInstrumento").value.trim(),

            // Valor temporário para manter compatibilidade
            // com o backend atual, que ainda espera categoria.
            categoria: "Não especificada",

            descricao: document.getElementById("descricaoInstrumento").value.trim(),

            imagem: document.getElementById("imagemInstrumento").value.trim()
        };

        // Validação dos campos
        if (!instrumento.emailUsuario || !instrumento.nome) {

            mostrarMensagem(
                mensagem,
                "Preencha o e-mail e o nome do instrumento.",
                "erro"
            );

            return;
        }

        if (botao) {
            botao.disabled = true;
        }

        mostrarMensagem(
            mensagem,
            "Cadastrando instrumento...",
            ""
        );

        try {

            const resposta = await fetch("/api/instrumentos", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(instrumento)

            });

            const resultado = await obterResultado(resposta);

            formInstrumento.reset();

            mostrarMensagem(
                mensagem,
                "Instrumento cadastrado com sucesso!",
                "sucesso"
            );

            console.log(
                "Instrumento cadastrado:",
                resultado.instrumento
            );

        } catch (erro) {

            mostrarMensagem(
                mensagem,
                erro.message,
                "erro"
            );

            console.error(
                "Erro ao cadastrar instrumento:",
                erro
            );

        } finally {

            if (botao) {
                botao.disabled = false;
            }

        }

    });

}


// ===============================
// CARREGAR OBRAS DE ARTE
// ===============================

async function carregarObras() {

    const container = document.querySelector(".todosCards");

    // Se a página não possuir esse container, encerra a função
    if (!container) return;

    try {

        const resposta = await fetch("/api/lista");

        const dados = await obterResultado(resposta);

        // Limpa o conteúdo anterior
        container.innerHTML = "";

        if (!Array.isArray(dados) || dados.length === 0) {

            container.textContent = "Nenhuma obra de arte cadastrada.";

            return;
        }

        // Percorre as obras recebidas do servidor
        dados.forEach(function (obra) {

            const card = document.createElement("div");
            card.classList.add("card");

            const texto = document.createElement("div");
            texto.classList.add("texto");

            const titulo = document.createElement("h3");
            titulo.textContent = obra.titulo || "Obra sem título";

            const descricao = document.createElement("p");
            descricao.textContent = obra.descricao || "";

            const imagemContainer = document.createElement("div");
            imagemContainer.classList.add("img");

            const imagem = document.createElement("img");

            imagem.src = obra.imagem || "";
            imagem.alt =
                obra.descImagem ||
                obra.linkImagem ||
                obra.titulo ||
                "Imagem da obra";

            texto.appendChild(titulo);
            texto.appendChild(descricao);

            imagemContainer.appendChild(imagem);

            card.appendChild(texto);
            card.appendChild(imagemContainer);

            container.appendChild(card);

        });

    } catch (erro) {

        console.error(
            "Erro ao buscar as obras:",
            erro
        );

        container.textContent =
            "Não foi possível carregar as obras de arte.";

    }

}

// Carrega as obras quando a página é aberta
carregarObras();


// ===============================
// VERIFICAR SISTEMA
// ===============================

console.log(
    "Sistema Claveon carregado!"
);
