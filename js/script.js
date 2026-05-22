const titulo = document.getElementById("titulo");

titulo.addEventListener("click", function() {
    titulo.style.color = "blue";
});
function renderizarCards(instrumentos) {
    const novoCard = `
        <div class="card">
            <div class="letras">
                <h3 id="titulo">${instrumentos.titulo}</h3>
                <p>${instrumentos.texto}</p>
            </div>

            <div class="img">
                <img src="${instrumentos.imagem}" alt="${instrumentos.descricao}"/>
            </div>
        </div>
    `;

    colecao.innerHTML += novoCard;
}
