    // ===========================
// MOSTRAR / OCULTAR SENHA
// ===========================

function toggleSenha(idCampo, botao) {
    const campo = document.getElementById(idCampo);

    if (!campo) {
        console.error("Campo de senha não encontrado:", idCampo);
        return;
    }

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

if (!formulario) {
    console.error(
        'Erro: formulário com id="formCadastro" não encontrado. Verifique o cadastro.html.'
    );
} else {

    console.log("Sistema de cadastro carregado com sucesso!");

    formulario.addEventListener("submit", function (event) {

        event.preventDefault();

        console.log("Envio do formulário iniciado.");

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;

        const mensagem = document.getElementById("mensagem");

        if (!mensagem) {
            console.error('Elemento com id="mensagem" não encontrado.');
            return;
        }

        mensagem.className = "mensagem";
        mensagem.textContent = "";


        // ===========================
        // VALIDAÇÕES
        // ===========================

        if (nome.length < 3) {
            mensagem.textContent = "Informe um nome válido.";
            mensagem.classList.add("erro");

            console.warn("Cadastro recusado: nome inválido.");
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            mensagem.textContent = "Digite um e-mail válido.";
            mensagem.classList.add("erro");

            console.warn("Cadastro recusado: e-mail inválido.");
            return;
        }

        if (telefone.length < 10) {
            mensagem.textContent = "Digite um telefone válido.";
            mensagem.classList.add("erro");

            console.warn("Cadastro recusado: telefone inválido.");
            return;
        }

        if (senha.length < 8) {
            mensagem.textContent = "A senha deve possuir no mínimo 8 caracteres.";
            mensagem.classList.add("erro");

            console.warn("Cadastro recusado: senha muito curta.");
            return;
        }

        if (senha !== confirmarSenha) {
            mensagem.textContent = "As senhas não coincidem.";
            mensagem.classList.add("erro");

            console.warn("Cadastro recusado: as senhas não coincidem.");
            return;
        }


        // ===========================
        // RECUPERAR CADASTROS SALVOS
        // ===========================

        let cadastros = [];

        try {
            cadastros = JSON.parse(localStorage.getItem("cadastros")) || [];

            if (!Array.isArray(cadastros)) {
                cadastros = [];
            }

        } catch (erro) {
            console.error("Erro ao recuperar os cadastros:", erro);

            mensagem.textContent = "Erro ao recuperar os cadastros salvos.";
            mensagem.classList.add("erro");
            return;
        }


        // ===========================
        // CRIAR NOVO CADASTRO
        // ===========================

        const novoCadastro = {
            nome: nome,
            email: email,
            telefone: telefone,
            senha: senha
        };


        // ===========================
        // SALVAR CADASTRO
        // ===========================

        cadastros.push(novoCadastro);

        try {
            localStorage.setItem("cadastros", JSON.stringify(cadastros));

        } catch (erro) {
            console.error("Erro ao salvar o cadastro:", erro);

            cadastros.pop();

            mensagem.textContent = "Não foi possível salvar o cadastro.";
            mensagem.classList.add("erro");
            return;
        }


        // ===========================
        // MOSTRAR NO CONSOLE
        // ===========================

        console.log("================================");
        console.log("CADASTRO REALIZADO COM SUCESSO!");
        console.log("Nome:", nome);
        console.log("E-mail:", email);
        console.log("Telefone:", telefone);
        console.log("Total de cadastros:", cadastros.length);
        console.log("Todos os cadastros:", cadastros);
        console.log("================================");


        // ===========================
        // MENSAGEM DE SUCESSO
        // ===========================

        mensagem.textContent = "Cadastro realizado com sucesso!";
        mensagem.classList.add("sucesso");


        // ===========================
        // LIMPAR CAMPOS
        // ===========================

        formulario.reset();

        document.getElementById("senha").type = "password";
        document.getElementById("confirmarSenha").type = "password";

        document.querySelectorAll(".btn-olho").forEach(botao => {
            botao.textContent = "Ver";
        });


        // ===========================
        // REMOVER MENSAGEM
        // ===========================

        setTimeout(() => {
            mensagem.textContent = "";
            mensagem.className = "mensagem";
        }, 3000);

    });

}


// ===========================
// MODAL DE CONTATO
// ===========================

function abrirContato() {

    const modal = document.getElementById("modalContato");

    if (!modal) {
        console.error('Modal com id="modalContato" não encontrado.');
        return;
    }

    modal.style.display = "flex";

    console.log("Modal de contato aberto.");
}


function fecharContato() {

    const modal = document.getElementById("modalContato");

    if (!modal) {
        console.error('Modal com id="modalContato" não encontrado.');
        return;
    }

    modal.style.display = "none";

    console.log("Modal de contato fechado.");
}


// ===========================
// FECHAR CLICANDO FORA
// ===========================

window.addEventListener("click", function (event) {

    const modal = document.getElementById("modalContato");

    if (modal && event.target === modal) {
        modal.style.display = "none";
        console.log("Modal fechado ao clicar fora.");
    }

});


// ===========================
// FECHAR COM ESC
// ===========================

document.addEventListener("keydown", function (event) {

    const modal = document.getElementById("modalContato");

    if (event.key === "Escape" && modal) {
        modal.style.display = "none";
    }

});


// ===========================
// VERIFICAR CADASTROS SALVOS
// ===========================

try {
    const cadastrosSalvos = JSON.parse(
        localStorage.getItem("cadastros")
    ) || [];

    console.log("Cadastros existentes no navegador:", cadastrosSalvos.length);
    console.log("Sistema de cadastro pronto.");

} catch (erro) {
    console.error("Erro ao verificar os cadastros existentes:", erro);
}
```
