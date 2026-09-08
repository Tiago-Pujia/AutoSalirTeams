// ===========================================================
// AutoSalirTeams — https://github.com/Tiago-Pujia/AutoSalirTeams
// Cierra automáticamente la llamada de Teams cuando los
// participantes bajan del umbral configurado.
// ===========================================================

(function () {
    "use strict";

    // -- CONFIGURACION ---------------------------------------
    const USUARIOS_MAXIMO = 13;
    const USUARIOS_UMBRAL_ACTIVACION = USUARIOS_MAXIMO + 5;
    const REINTENTOS_MAX = 15;
    const REINTENTO_INTERVALO_MS = 2000;

    // -- ESTADO ----------------------------------------------
    let observadorSalidaActivado = false;
    let observador = null;
    let overlayElement = null;

    // -- ESTILOS DE CONSOLA ----------------------------------
    const ESTILOS = {
        info:    "color:#60a5fa;font-weight:bold",
        ok:      "color:#34d399;font-weight:bold",
        warn:    "color:#fbbf24;font-weight:bold",
        error:   "color:#f87171;font-weight:bold",
        detalle: "color:#94a3b8;font-style:italic",
    };

    const log = (estilo, mensaje) => {
        console.log(
            `%c[AutoSalir]%c ${mensaje}`,
            ESTILOS[estilo],
            ESTILOS.detalle
        );
    };

    // -- OVERLAY VISUAL --------------------------------------
    const ESTADOS_OVERLAY = {
        esperando: { texto: "Esperando participantes...", color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
        armado:    { texto: "Armado", color: "#34d399", bg: "rgba(52,211,153,0.12)" },
        saliendo:  { texto: "Saliendo de la llamada...", color: "#f87171", bg: "rgba(248,113,113,0.12)" },
        error:     { texto: "Error: elemento no encontrado", color: "#f87171", bg: "rgba(248,113,113,0.12)" },
    };

    const crearOverlay = () => {
        const el = document.createElement("div");
        el.id = "autosalir-overlay";
        el.style.cssText = [
            "position:fixed",
            "top:12px",
            "left:12px",
            "z-index:2147483647",
            "font-family:'Segoe UI',system-ui,sans-serif",
            "font-size:13px",
            "padding:8px 14px",
            "border-radius:10px",
            "backdrop-filter:blur(8px)",
            "box-shadow:0 2px 12px rgba(0,0,0,0.25)",
            "display:flex",
            "align-items:center",
            "gap:8px",
            "transition:all 0.3s ease",
            "cursor:default",
            "user-select:none",
            "opacity:0",
            "transform:translateY(-8px)",
        ].join(";");

        // Texto del estado
        const textoSpan = document.createElement("span");
        textoSpan.id = "autosalir-texto";
        el.appendChild(textoSpan);

        // Boton de cerrar
        const cerrar = document.createElement("span");
        cerrar.textContent = "X";
        cerrar.title = "Cerrar overlay (el script sigue activo)";
        cerrar.style.cssText = [
            "cursor:pointer",
            "opacity:0.5",
            "font-size:14px",
            "margin-left:4px",
            "transition:opacity 0.2s",
        ].join(";");
        cerrar.addEventListener("mouseenter", () => { cerrar.style.opacity = "1"; });
        cerrar.addEventListener("mouseleave", () => { cerrar.style.opacity = "0.5"; });
        cerrar.addEventListener("click", () => {
            el.style.opacity = "0";
            el.style.transform = "translateY(-8px)";
            setTimeout(() => el.remove(), 300);
            log("info", "Overlay cerrado. El script sigue activo en segundo plano.");
        });
        el.appendChild(cerrar);

        document.body.appendChild(el);

        // Animacion de entrada
        requestAnimationFrame(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        });

        return el;
    };

    const actualizarOverlay = (estado, extra = "") => {
        if (!overlayElement || !document.body.contains(overlayElement)) return;
        const { texto, color, bg } = ESTADOS_OVERLAY[estado];
        const textoSpan = overlayElement.querySelector("#autosalir-texto");
        if (textoSpan) textoSpan.textContent = texto + (extra ? ` ${extra}` : "");
        overlayElement.style.color = color;
        overlayElement.style.borderLeft = `3px solid ${color}`;
        overlayElement.style.background = bg;
    };

    // -- FUNCIONES PRINCIPALES -------------------------------
    const obtenerCantidadUsuarios = () => {
        const tag = document.querySelector("[data-tid='roster-button-tile']");
        return tag ? parseInt(tag.textContent, 10) : 1;
    };

    const salirLlamada = () => {
        const tagBotonExit = document.querySelector("#hangup-button");
        if (tagBotonExit) {
            actualizarOverlay("saliendo");
            log("warn", "Saliendo de la llamada...");
            tagBotonExit.click();
            if (observador) observador.disconnect();
            return true;
        }

        log("error", "No se encontro el boton de colgar (#hangup-button).");
        actualizarOverlay("error");
        return false;
    };

    const verificarUmbralYSalir = () => {
        const cantidad = obtenerCantidadUsuarios();

        // Activar la logica de salida una vez que se supere el umbral
        if (!observadorSalidaActivado && cantidad > USUARIOS_UMBRAL_ACTIVACION) {
            observadorSalidaActivado = true;
            log("ok", `Umbral de activacion superado (${cantidad} > ${USUARIOS_UMBRAL_ACTIVACION}). Script armado.`);
            actualizarOverlay("armado", `(${cantidad} usuarios)`);
        }

        if (observadorSalidaActivado) {
            actualizarOverlay("armado", `(${cantidad} usuarios)`);
        }

        // Solo salir si ya se activo y la cantidad bajo
        if (observadorSalidaActivado && cantidad < USUARIOS_MAXIMO) {
            log("warn", `Participantes (${cantidad}) < umbral (${USUARIOS_MAXIMO}). Ejecutando salida...`);
            return salirLlamada();
        }

        return false;
    };

    // -- INICIALIZACION CON REINTENTOS -----------------------
    const iniciar = () => {
        overlayElement = crearOverlay();
        actualizarOverlay("esperando");

        log("info", "AutoSalirTeams iniciado.");
        log("info", `Configuracion: salir cuando usuarios < ${USUARIOS_MAXIMO} (activacion > ${USUARIOS_UMBRAL_ACTIVACION})`);

        let intentos = 0;

        const intentarConectar = () => {
            intentos++;
            const tagCantidadUsuarios = document.querySelector("[data-tid='roster-button-tile']");

            if (tagCantidadUsuarios) {
                observador = new MutationObserver(verificarUmbralYSalir);
                observador.observe(tagCantidadUsuarios, {
                    childList: true,
                    subtree: true,
                    characterData: true,
                });

                const cantidadActual = obtenerCantidadUsuarios();
                log("ok", `Conectado al DOM. Participantes actuales: ${cantidadActual}.`);
                log("info", "Observando cambios en la cantidad de participantes...");
                actualizarOverlay("esperando");
                return;
            }

            if (intentos >= REINTENTOS_MAX) {
                log("error", `No se encontro el elemento del roster tras ${REINTENTOS_MAX} intentos. Esta abierta la llamada?`);
                actualizarOverlay("error");
                return;
            }

            log("warn", `Elemento no encontrado. Reintentando... (${intentos}/${REINTENTOS_MAX})`);
            setTimeout(intentarConectar, REINTENTO_INTERVALO_MS);
        };

        intentarConectar();
    };

    // -- EJECUTAR --------------------------------------------
    iniciar();
})();