// CONSTANTES
const USUARIOS_MAXIMO = 13;
const USUARIOS_UMBRAL_ACTIVACION = USUARIOS_MAXIMO + 5; // 18


// ESTADO
let observadorSalidaActivado = false;


// FUNCIONES
const obtenerCantidadUsuarios = () => {
    const tag = document.querySelector("[data-tid='roster-button-tile']");
    return tag ? parseInt(tag.textContent, 10) : 1;
};

const salirLlamada = () => {
    const tagBotonExit = document.querySelector("#hangup-button");
    if (tagBotonExit) {
        tagBotonExit.click();
        observador.disconnect();
	return true;
    }

return false;
};

const verificarUmbralYSalir = () => {
    const cantidad = obtenerCantidadUsuarios();

    // Activar la lógica de salida una vez que se supere el umbral
    if (!observadorSalidaActivado && cantidad > USUARIOS_UMBRAL_ACTIVACION) {
        observadorSalidaActivado = true;
    }

    // Solo salir si ya se activó y la cantidad bajó (incluyendo cuando el tag desaparece → cantidad = 1)
    if (observadorSalidaActivado && cantidad < USUARIOS_MAXIMO) {
        return salirLlamada();
    }
	return false;
};


// MAIN

// Crear un observador para detectar cambios en la cantidad de usuarios
const tagCantidadUsuarios = document.querySelector("[data-tid='roster-button-tile']");
const observador = new MutationObserver(verificarUmbralYSalir);

if(tagCantidadUsuarios)
	observador.observe(tagCantidadUsuarios, { childList: true, subtree: true, characterData: true });
else
	console.log("Faltan elemenos en el DOM");