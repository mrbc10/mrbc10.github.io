
 // ===========================
// CLASSE DO INSTRUMENTO
// ===========================

class ObraDeArte {
    constructor(t, desc, img, alt) {
        this.t = t;
        this.desc = desc;
        this.img = img;
        this.alt = alt;
    }
}


// ===========================
// CADASTRO DE INSTRUMENTOS
// ===========================

const form = document.getElementById('formInstrumento');

if (form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const t = document.getElementById('t').value.trim();
        const desc = document.getElementById('desc').value.trim();
        const img = document.getElementById('img').value.trim();
        const alt = document.getElementById('alt').value.trim();
        const mensagem = document.getElementById('mensagemInstrumento');
        const botao = form.querySelector('button[type="submit"]');

        mensagem.className = 'mensagem';
        mensagem.textContent = '';

        if (!t || !desc || !img || !alt) {
            mensagem.textContent = 'Preencha todos os campos.';
            mensagem.classList.add('erro');
            return;
        }

        const novaObra = new ObraDeArte(t, desc, img, alt);

        try {
            botao.disabled = true;
            mensagem.textContent = 'Enviando instrumento...';

            const resposta = await fetch('/api/lista', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novaObra)
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    resultado.mensagem || 'Não foi possível cadastrar o instrumento.'
                );
            }

            console.log('Instrumento cadastrado com sucesso!');
            console.log(novaObra);

            mensagem.textContent = resultado.mensagem;
            mensagem.classList.add('sucesso');

            form.reset();

        } catch (erro) {
            console.error('Erro ao cadastrar instrumento:', erro);

            mensagem.textContent =
                'Não foi possível enviar o instrumento. Verifique se o servidor está funcionando.';
            mensagem.classList.add('erro');

        } finally {
            botao.disabled = false;
        }
    });
}


// ===========================
// MODAL DE CONTATO
// ===========================

function abrirContato() {
    const modal = document.getElementById('modalContato');

    if (modal) {
        modal.style.display = 'flex';
    }
}

function fecharContato() {
    const modal = document.getElementById('modalContato');

    if (modal) {
        modal.style.display = 'none';
    }
}

// Fecha o modal ao clicar fora dele
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modalContato');

    if (modal && event.target === modal) {
        modal.style.display = 'none';
    }
});

// Fecha o modal ao pressionar ESC
document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('modalContato');

    if (event.key === 'Escape' && modal) {
        modal.style.display = 'none';
    }
});
