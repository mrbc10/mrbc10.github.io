// ===========================
// MOSTRAR / OCULTAR SENHA
// ===========================

function toggleSenha(idCampo, botao) {

    const campo = document.getElementById(idCampo);

    if (campo.type === "password") {
        campo.type = "text";
        botao.textContent = "Ocultar";
    } else {
        campo.type = "password";
        botao.textContent = "Ver";
    }

}

// ===========================
// VALIDAÇÃO DO FORMULÁRIO
// ===========================

const formulario = document.getElementById("formCadastro");

formulario.addEventListener("submit", function (event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    const mensagem = document.getElementById("mensagem");

    mensagem.className = "mensagem";
    mensagem.textContent = "";

    // Nome
    if (nome.length < 3) {
        mensagem.textContent = "Informe um nome válido.";
        mensagem.classList.add("erro");
        return;
    }

    // E-mail
    if (!email.includes("@") || !email.includes(".")) {
        mensagem.textContent = "Digite um e-mail válido.";
        mensagem.classList.add("erro");
        return;
    }

    // Telefone
    if (telefone.length < 10) {
        mensagem.textContent = "Digite um telefone válido.";
        mensagem.classList.add("erro");
        return;
    }

    // Senha
    if (senha.length < 8) {
        mensagem.textContent = "A senha deve possuir no mínimo 8 caracteres.";
        mensagem.classList.add("erro");
        return;
    }

    // Confirmar senha
    if (senha !== confirmarSenha) {
        mensagem.textContent = "As senhas não coincidem.";
        mensagem.classList.add("erro");
        return;
    }

    // Sucesso
    mensagem.textContent = "Cadastro realizado com sucesso!";
    mensagem.classList.add("sucesso");

    // Limpa os campos
    formulario.reset();

    // Volta as senhas para oculto
    document.getElementById("senha").type = "password";
    document.getElementById("confirmarSenha").type = "password";

    // Restaura o texto dos botões
    document.querySelectorAll(".btn-olho").forEach(botao => {
        botao.textContent = "Ver";
    });

    // Remove a mensagem após 3 segundos
    setTimeout(() => {
        mensagem.textContent = "";
        mensagem.className = "mensagem";
    }, 3000);

});

// ===========================
// MODAL DE CONTATO
// ===========================

function abrirContato() {
    document.getElementById("modalContato").style.display = "flex";
}

function fecharContato() {
    document.getElementById("modalContato").style.display = "none";
}

// Fecha clicando fora do modal
window.onclick = function (event) {

    const modal = document.getElementById("modalContato");

    if (event.target === modal) {
        modal.style.display = "none";
    }

};

// Fecha ao pressionar ESC
document.addEventListener("keydown", function (event) {

    const modal = document.getElementById("modalContato");

    if (event.key === "Escape") {
        modal.style.display = "none";
    }

});