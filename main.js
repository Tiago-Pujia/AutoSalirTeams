const USUARIOS_MAXIMO = 15; // Cantidad de usuarios maximos para irse
const INTERVALO_MS = 1000; // En milisegundos

const intervalo = setInterval(() => {
    const tagBotonExit = document.querySelector("#hangup-button");
    const tagCantidadUsuarios = document.querySelector("[data-tid='roster-button-tile']");
    const cantidadUsuarios = !tagCantidadUsuarios ? 1 : parseInt(tagCantidadUsuarios.textContent, 10);

    if (cantidadUsuarios < USUARIOS_MAXIMO && tagBotonExit) {
        tagBotonExit.click();
        clearInterval(intervalo);
    }
}, INTERVALO_MS);
