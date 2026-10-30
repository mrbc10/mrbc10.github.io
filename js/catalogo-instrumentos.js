
// ===============================
// CATÁLOGO DE INSTRUMENTOS
// ===============================

async function carregarCatalogo() {

    const container = document.getElementById("listaInstrumentos");

    // Verifica se a página possui o catálogo
    if (!container) return;

    try {

        const resposta = await fetch("/api/instrumentos");

        if (!resposta.ok) {
            throw new Error("Não foi possível buscar os instrumentos.");
        }

        const instrumentos = await resposta.json();

        container.innerHTML = "";

        // Verifica se existem instrumentos cadastrados
        if (!Array.isArray(instrumentos) || instrumentos.length === 0) {

            const mensagem = document.createElement("p");
            mensagem.classList.add("estado-catalogo");
            mensagem.textContent = "Nenhum instrumento foi cadastrado ainda.";

            container.appendChild(mensagem);

            return;
        }

        // Percorre os instrumentos recebidos do servidor
        instrumentos.forEach(function (instrumento) {

            // Cria o card
            const card = document.createElement("article");
            card.classList.add("card-instrumento");

            // ===============================
            // ÁREA DA IMAGEM
            // ===============================

            const imagemContainer = document.createElement("div");
            imagemContainer.classList.add("imagem-instrumento");

            if (instrumento.imagem) {

                const imagem = document.createElement("img");

                imagem.src = instrumento.imagem;
                imagem.alt = instrumento.nome || "Instrumento";

                imagem.addEventListener("error", function () {

                    imagemContainer.innerHTML = "";

                    const aviso = document.createElement("span");
                    aviso.classList.add("sem-imagem");
                    aviso.textContent = "Imagem indisponível";

                    imagemContainer.appendChild(aviso);
                });

                imagemContainer.appendChild(imagem);

            } else {

                const aviso = document.createElement("span");
                aviso.classList.add("sem-imagem");
                aviso.textContent = "Sem imagem cadastrada";

                imagemContainer.appendChild(aviso);
            }

            // ===============================
            // ÁREA DAS INFORMAÇÕES
            // ===============================

            const informacoes = document.createElement("div");
            informacoes.classList.add("informacoes-instrumento");

            const nome = document.createElement("h2");
            nome.textContent = instrumento.nome || "Sem nome";

            const descricao = document.createElement("p");
            descricao.classList.add("descricao-instrumento");
            descricao.textContent =
                instrumento.descricao || "Nenhuma descrição informada.";

            // ===============================
            // RESPONSÁVEL PELO CADASTRO
            // ===============================

            const responsavel = document.createElement("div");
            responsavel.classList.add("responsavel-instrumento");

            const tituloResponsavel = document.createElement("h3");
            tituloResponsavel.textContent = "Cadastrado por:";

            const nomeUsuario = document.createElement("p");
            nomeUsuario.textContent =
                "Nome: " + (instrumento.usuario?.nome || "Não informado");

            const emailUsuario = document.createElement("p");
            emailUsuario.textContent =
                "E-mail: " + (instrumento.usuario?.email || "Não informado");

            // Monta as informações do responsável
            responsavel.appendChild(tituloResponsavel);
            responsavel.appendChild(nomeUsuario);
            responsavel.appendChild(emailUsuario);

            // ===============================
            // MONTAGEM DO CARD
            // ===============================

            informacoes.appendChild(nome);
            informacoes.appendChild(descricao);
            informacoes.appendChild(responsavel);

            card.appendChild(imagemContainer);
            card.appendChild(informacoes);

            container.appendChild(card);

        });

    } catch (erro) {

        console.error("Erro ao carregar catálogo:", erro);

        const mensagem = document.createElement("p");
        mensagem.classList.add("estado-catalogo");
        mensagem.textContent =
            "Não foi possível carregar os instrumentos. Tente novamente mais tarde.";

        container.innerHTML = "";
        container.appendChild(mensagem);
    }
}

// Carrega o catálogo quando a página abre
carregarCatalogo();
