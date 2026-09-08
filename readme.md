# AutoSalirTeams

> Cierra automáticamente la llamada de Microsoft Teams cuando los participantes comienzan a irse.

---

## Compatibilidad

> **Importante:** El script solo funciona con la **versión web** de Microsoft Teams (`teams.microsoft.com`), no con la aplicación de escritorio.

---

## Uso rápido

1. Entrá a la llamada de Teams **desde el navegador** (no la app de escritorio).
2. Abrí la consola del navegador con `F12` o `Ctrl+Shift+I`.
3. Copiá y pegá el contenido de [`main.js`](main.js) en la consola y presioná `Enter`.
4. Listo! Vas a ver un badge en la esquina superior izquierda confirmando que el script está activo.

> **Tip:** Podés usar una extensión para inyectar el script automáticamente cada vez que entrés a Teams:
> - **Chrome / Edge:** [Custom JavaScript for Websites](https://chromewebstore.google.com/detail/custom-javascript-for-web/ddbjnfjiigjmcpcpkmhogomapikjbjdk)
> - **Firefox:** [Code Injector](https://addons.mozilla.org/es-AR/firefox/addon/codeinjector/)

---

## Características

- **Detección automática** — Observa en tiempo real la cantidad de participantes.
- **Umbral inteligente** — Solo se activa después de que se haya llenado la clase, evitando salir al inicio de la llamada.
- **Reintentos automáticos** — Si pegás el script antes de que cargue la UI de Teams, reintenta la conexión automáticamente.
- **Overlay visual** — Badge flotante en pantalla que muestra el estado actual del script (esperando, armado, saliendo).
- **Logs en consola** — Mensajes con estilo para saber exactamente qué está pasando.
- **Sin contaminación** — El script corre encapsulado en una IIFE, no deja variables globales.

---

## Configuración

Podés ajustar estas constantes al inicio de `main.js`:

```js
const USUARIOS_MAXIMO = 13;           // Cuando los usuarios bajan de este número, se sale
const USUARIOS_UMBRAL_ACTIVACION = USUARIOS_MAXIMO + 5;  // El script se "arma" recién cuando se supera este número
```

### Cómo funciona el umbral?

| Fase | Condición | Acción |
|------|-----------|--------|
| **Esperando** | Participantes <= umbral de activación | El script observa pero no actúa |
| **Armado** | Participantes > umbral de activación | El script está listo para salir cuando bajen |
| **Salida** | Participantes < `USUARIOS_MAXIMO` | Se hace clic en el botón de colgar automáticamente |

**Ejemplo:** Con la configuración por defecto, el script espera a que haya más de 18 personas (la clase se llenó). Cuando los participantes bajan de 13, te saca automáticamente.

---

## Cómo funciona internamente?

1. Se inyecta un `MutationObserver` en el elemento del contador de participantes (`roster-button-tile`).
2. Cada vez que el número cambia, se verifica contra los umbrales configurados.
3. Si el script está armado y los participantes bajan del mínimo, hace clic en `#hangup-button`.
4. Si el elemento del DOM no existe al momento de pegar el script, reintenta cada 2 segundos (hasta 15 veces).