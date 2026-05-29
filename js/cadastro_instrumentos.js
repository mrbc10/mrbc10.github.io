document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // 1. ARRAY PRINCIPAL
    // =========================
    let galeriaInstrumentos = [];

    // =========================
    // 2. PEGAR DADOS SALVOS
    // =========================
    const dadosSalvos = localStorage.getItem("galeriaInstrumentos");

    // =========================
    // 3. VERIFICAR SE EXISTE
    // =========================
    if (dadosSalvos) {

        galeriaInstrumentos = JSON.parse(dadosSalvos);

    }

    // =========================
    // 4. CAPTURAR ELEMENTOS
    // =========================
    const formularioInstrumento = document.getElementById("formCadastro");

    const listaInstrumentos = document.getElementById("listaUsuarios");

    // =========================
    // 5. MOSTRAR INSTRUMENTOS
    // =========================
    galeriaInstrumentos.forEach(function (instrumento) {

        criarCardInstrumento(instrumento);

    });

    // =========================
    // 6. EVENTO SUBMIT
    // =========================
    formularioInstrumento.addEventListener("submit", function (evento) {

        evento.preventDefault();

        // =========================
        // 7. CAPTURAR DADOS
        // =========================
        const nome = document.getElementById("nome").value;

        const email = document.getElementById("email").value;

        const senha = document.getElementById("senha").value;

        const imagem = document.getElementById("imagem").value;

        const descricao = document.getElementById("descricao").value;

        // =========================
        // 8. CRIAR OBJETO
        // =========================
        const novoInstrumento = {

            nome: nome,

            email: email,

            senha: senha,

            imagem: imagem,

            descricao: descricao

        };

        // =========================
        // 9. VERIFICAR DUPLICADOS
        // =========================
        const instrumentoExistente = galeriaInstrumentos.some(function (instrumento) {

            return instrumento.nome.trim().toLowerCase() ===
                novoInstrumento.nome.trim().toLowerCase();

        });

        // =========================
        // 10. SE JÁ EXISTIR
        // =========================
        if (instrumentoExistente) {

            alert("Esse instrumento já foi cadastrado!");

            return;

        }

        // =========================
        // 11. ADICIONAR NO ARRAY
        // =========================
        galeriaInstrumentos.push(novoInstrumento);

        // =========================
        // 12. SALVAR LOCALSTORAGE
        // =========================
        localStorage.setItem(

            "galeriaInstrumentos",

            JSON.stringify(galeriaInstrumentos)

        );

        // =========================
        // 13. MOSTRAR CARD
        // =========================
        criarCardInstrumento(novoInstrumento);

        // =========================
        // 14. LIMPAR FORMULÁRIO
        // =========================
        formularioInstrumento.reset();

    });

    // =========================
    // FUNÇÃO CRIAR CARD
    // =========================
    function criarCardInstrumento(instrumento) {

        const card = document.createElement("div");

        card.classList.add("cardInstrumento");

        card.innerHTML = `

            <h3 style="font-size: 30px">
                ${instrumento.nome}
            </h3>

            <p>
                <strong>Email:</strong>
                ${instrumento.email}
            </p>

            <p>
                <strong>Senha:</strong>
                ${instrumento.senha}
            </p>

            <img 
                src="${instrumento.imagem}" 
                alt="Imagem do instrumento"

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
                ${instrumento.descricao}
            </p>

        `;

        listaInstrumentos.appendChild(card);

    }

});