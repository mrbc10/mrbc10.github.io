function abrirContato() {
    document.getElementById("modalContato").style.display = "flex";
}

function fecharContato() {
    document.getElementById("modalContato").style.display = "none";
}

// Fecha o modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById("modalContato");

    if (event.target === modal) {
        modal.style.display = "none";
    }
};

// Fecha o modal ao pressionar ESC
document.addEventListener("keydown", function(event) {
    const modal = document.getElementById("modalContato");

    if (event.key === "Escape" && modal.style.display === "flex") {
        modal.style.display = "none";
    }
});