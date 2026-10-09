
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
// VALIDAÇÃO E ENVIO DO CADASTRO
// ===========================

const formulario = document.getElementById("formCadastro");

if (!formulario) {
    console.error(
        'Erro: formulário com id="formCadastro" não encontrado. Verifique o cadastro.html.'
    );
} else {

    console.log("Sistema de cadastro carregado com sucesso!");

    formulario.addEventListener("submit", async function (event) {

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
        // CRIAR NOVO CADASTRO
        // ===========================

        const novoCadastro = {
            nome: nome,
            email: email,
            telefone: telefone,
            senha: senha
        };

        // ===========================
        // ENVIAR CADASTRO AO SERVIDOR
        // ===========================

        try {
            mensagem.textContent = "Enviando cadastro...";
            formulario.querySelectorAll("input, button").forEach(elemento => {
                elemento.disabled = true;
            });

            const resposta = await fetch("/api/cadastro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novoCadastro)
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    resultado.mensagem || "Não foi possível realizar o cadastro."
                );
            }

            console.log("================================");
            console.log("CADASTRO ENVIADO AO SERVIDOR!");
            console.log("Nome:", nome);
            console.log("E-mail:", email);
            console.log("Telefone:", telefone);
            console.log("Resposta do servidor:", resultado.mensagem);
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

        } catch (erro) {
            console.error("Erro ao enviar cadastro:", erro);

            mensagem.textContent =
                erro.message === "Failed to fetch"
                    ? "Não foi possível conectar ao servidor. Verifique se ele está iniciado."
                    : erro.message || "Ocorreu um erro ao realizar o cadastro.";

            mensagem.classList.add("erro");

        } finally {
            formulario.querySelectorAll("input, button").forEach(elemento => {
                elemento.disabled = false;
            });
        }
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
// VERIFICAR SISTEMA
// ===========================

console.log("Sistema de cadastro pronto.");
