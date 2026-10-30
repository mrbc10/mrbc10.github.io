
// ===========================
// CATÁLOGO DE INSTRUMENTOS
// ===========================

// E-mail do usuário que está utilizando o catálogo
function obterEmailUsuario() {
    return localStorage.getItem("emailUsuarioClaveon") || "";
}


// ===========================
// CARREGAR CATÁLOGO
// ===========================

async function carregarCatalogo() {

    const container = document.getElementById("listaInstrumentos");

    if (!container) return;

    try {

        const resposta = await fetch("/api/instrumentos");

        if (!resposta.ok) {
            throw new Error("Não foi possível buscar os instrumentos.");
        }

        const instrumentos = await resposta.json();

        container.innerHTML = "";

        if (!Array.isArray(instrumentos) || instrumentos.length === 0) {

            const mensagem = document.createElement("p");
            mensagem.classList.add("estado-catalogo");
            mensagem.textContent = "Nenhum instrumento foi cadastrado ainda.";

            container.appendChild(mensagem);
            return;
        }

        const emailUsuario = obterEmailUsuario();

        let favoritosUsuario = [];

        // Carrega os favoritos do usuário
        if (emailUsuario) {

            const respostaFavoritos = await fetch(
                `/api/favoritos?email=${encodeURIComponent(emailUsuario)}`
            );

            if (respostaFavoritos.ok) {
                favoritosUsuario = await respostaFavoritos.json();
            }
        }

        instrumentos.forEach(function(instrumento) {

            const card = document.createElement("article");
            card.classList.add("card-instrumento");

            // ===========================
            // IMAGEM
            // ===========================

            const imagemContainer = document.createElement("div");
            imagemContainer.classList.add("imagem-instrumento");

            if (instrumento.imagem) {

                const imagem = document.createElement("img");

                imagem.src = instrumento.imagem;
                imagem.alt = instrumento.nome || "Instrumento";

                imagem.addEventListener("error", function() {

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


            // ===========================
            // INFORMAÇÕES
            // ===========================

            const informacoes = document.createElement("div");
            informacoes.classList.add("informacoes-instrumento");

            const nome = document.createElement("h2");
            nome.textContent = instrumento.nome || "Sem nome";

            const descricao = document.createElement("p");
            descricao.classList.add("descricao-instrumento");
            descricao.textContent =
                instrumento.descricao || "Nenhuma descrição informada.";

            const responsavel = document.createElement("div");
            responsavel.classList.add("responsavel-instrumento");

            const tituloResponsavel = document.createElement("h3");
            tituloResponsavel.textContent = "Cadastrado por:";

            const nomeUsuario = document.createElement("p");
            nomeUsuario.textContent =
                "Nome: " + (instrumento.usuario?.nome || "Não informado");

            const emailUsuarioInstrumento = document.createElement("p");
            emailUsuarioInstrumento.textContent =
                "E-mail: " + (instrumento.usuario?.email || "Não informado");

            responsavel.appendChild(tituloResponsavel);
            responsavel.appendChild(nomeUsuario);
            responsavel.appendChild(emailUsuarioInstrumento);


            // ===========================
            // BOTÃO DE FAVORITOS
            // ===========================

            const botaoFavorito = document.createElement("button");

            botaoFavorito.type = "button";
            botaoFavorito.classList.add("btn-favorito");

            const estaFavoritado = favoritosUsuario.some(
                favorito => favorito.id === instrumento.id
            );

            botaoFavorito.textContent = estaFavoritado ? "♥ Favoritado" : "♡ Favoritar";

            if (estaFavoritado) {
                botaoFavorito.classList.add("favoritado");
            }

            botaoFavorito.addEventListener("click", async function() {

                const email = obterEmailUsuario();

                if (!email) {
                    alert("Informe seu e-mail para utilizar os favoritos.");
                    return;
                }

                botaoFavorito.disabled = true;

                try {

                    let resposta;

                    if (botaoFavorito.classList.contains("favoritado")) {

                        resposta = await fetch("/api/favoritos", {
                            method: "DELETE",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({
                                emailUsuario: email,
                                idInstrumento: instrumento.id
                            })
                        });

                    } else {

                        resposta = await fetch("/api/favoritos", {
                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({
                                emailUsuario: email,
                                idInstrumento: instrumento.id
                            })
                        });
                    }

                    const resultado = await resposta.json();

                    if (!resposta.ok) {
                        throw new Error(resultado.mensagem);
                    }

                    botaoFavorito.classList.toggle("favoritado");

                    const agoraFavoritado =
                        botaoFavorito.classList.contains("favoritado");

                    botaoFavorito.textContent =
                        agoraFavoritado ? "♥ Favoritado" : "♡ Favoritar";

                    alert(resultado.mensagem);

                } catch (erro) {

                    alert(erro.message || "Não foi possível atualizar os favoritos.");

                } finally {

                    botaoFavorito.disabled = false;
                }
            });


            // ===========================
            // MONTAR CARD
            // ===========================

            informacoes.appendChild(nome);
            informacoes.appendChild(descricao);
            informacoes.appendChild(botaoFavorito);
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


// ===========================
// INICIAR CATÁLOGO
// ===========================

carregarCatalogo();
