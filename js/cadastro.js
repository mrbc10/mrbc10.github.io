document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // 1. VERIFICAR LOCALSTORAGE
    // =========================
    let galeria = [];

    const dadosSalvos = localStorage.getItem("galeria");

    if (dadosSalvos) {
        galeria = JSON.parse(dadosSalvos);
    }

    // =========================
    // 2. CAPTURAR ELEMENTOS
    // =========================
    const formulario = document.getElementById("formCadastro");
    const lista = document.getElementById("listaUsuarios");

    // =========================
    // 3. MOSTRAR USUÁRIOS SALVOS
    // =========================
    galeria.forEach(function (usuario) {
        criarCard(usuario);
    });

    // =========================
    // 4. EVENTO SUBMIT
    // =========================
    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        // =========================
        // 5. CAPTURAR DADOS
        // =========================
        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        const imagem = document.getElementById("imagem").value;
        const descricao = document.getElementById("descricao").value;

        // =========================
        // 6. CRIAR OBJETO
        // =========================
        const novoUsuario = {
            nome: nome,
            email: email,
            senha: senha,
            imagem: imagem,
            descricao: descricao
        };

        // =========================
        // 7. ADICIONAR NO ARRAY
        // =========================
        galeria.push(novoUsuario);

        // =========================
        // 8. SALVAR NO LOCALSTORAGE
        // =========================
        localStorage.setItem("galeria", JSON.stringify(galeria));

        // =========================
        // 9. MOSTRAR CARD
        // =========================
        criarCard(novoUsuario);

        // limpar formulário
        formulario.reset();
    });

    // =========================
    // FUNÇÃO CRIAR CARD
    // =========================
    function criarCard(usuario) {

        const card = document.createElement("div");

        card.classList.add("cardUsuario");

        card.innerHTML = `
            <h3 style="font-size: 30px">
                ${usuario.nome}
            </h3>

            <p>
                <strong>Email:</strong>
                ${usuario.email}
            </p>

            <p>
                <strong>Senha:</strong>
                ${usuario.senha}
            </p>

            <img 
                src="${usuario.imagem}" 
                alt="Imagem do usuário"
                style="
                    width: 200px;
                    height: auto;
                    display: block;
                    object-fit: contain;
                    margin: 10px auto;
                "
            >

            <p>
                <strong>Descrição:</strong>
                ${usuario.descricao}
            </p>
        `;

        lista.appendChild(card);
    }

});
