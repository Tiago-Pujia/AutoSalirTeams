// CONSTANTES
const USUARIOS_MAXIMO = 13;


// FUNCIONES
const obtenerCantidadUsuarios = () => {
    const tag = document.querySelector("[data-tid='roster-button-tile']");
    return tag ? parseInt(tag.textContent, 10) : 1;
};

const verificarYSalir = () => {
    const tagBotonExit = document.querySelector("#hangup-button");
    
    if (obtenerCantidadUsuarios() < USUARIOS_MAXIMO && tagBotonExit) {
        tagBotonExit.click();
        observer.disconnect();
    }
};


// MAIN
const tagCantidadUsuarios = document.querySelector("[data-tid='roster-button-tile']");
const observer = new MutationObserver(verificarYSalir); // Crear un observador para detectar cambios en la cantidad de usuarios

if (tagCantidadUsuarios) {
    observer.observe(tagCantidadUsuarios, { childList: true, subtree: true, characterData: true });
}