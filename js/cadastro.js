document.addEventListener("DOMContentLoaded", function() {

    // CAPTURAR o formulário
    const formulario = document.getElementById("formCadastro");

    formulario.addEventListener("submit", function(evento) {

        evento.preventDefault();

        // =========================
        // 1. CAPTURAR
        // =========================
        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        const imagem = document.getElementById("imagem").value;
        const descricao = document.getElementById("descricao").value;

        // =========================
        // 2. MONTAR
        // =========================
        const novoUsuario = {
            nome: nome,
            email: email,
            senha: senha,
            imagem: imagem,
            descricao: descricao
        };

        // =========================
        // 3. EXIBIR
        // =========================
        const lista = document.getElementById("listaUsuarios");

        if (!lista) {
            console.error("Div listaUsuarios não encontrada!");
            return;
        }

        const card = document.createElement("div");
        card.classList.add("cardUsuario");

        card.innerHTML = `
            <h3>${novoUsuario.nome}</h3>
            <p><strong>Email:</strong> ${novoUsuario.email}</p>
            <p><strong>Senha:</strong> ${novoUsuario.senha}</p>
            <p><strong>Imagem:</strong> ${novoUsuario.imagem}</p>
            <p><strong>Descrição:</strong> ${novoUsuario.descricao}</p>
        `;

        lista.appendChild(card);

        // limpar formulário
        formulario.reset();
    });

});
