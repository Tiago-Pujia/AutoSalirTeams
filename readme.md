# ¿Qué hace?
Cierra automáticamente la llamada de Teams cuando comienzan a irse los participantes.

# ¿Como utilizarlo?
1. Entra a la llamada desde el navegador.
2. Espera a que se unan los participantes.
3. Abre la consola del navegador (F12 o Ctrl+Shift+I).
4. Copia y pega el contenido de `main.js` y presiona Enter.

El script cierra la llamada cuando el número de usuarios baja del umbral configurado en `main.js`.

# ¿Cómo funciona?
El script observa cambios en el contador de participantes usando un `MutationObserver` en el elemento de la lista de asistentes. Cuando el número de usuarios es menor que `USUARIOS_MAXIMO`, se hace clic en el botón de colgar y se detiene el observador.

# ¿Como configurarlo?
Ajustas la variable global:

```js
const USUARIOS_MAXIMO = 13; // Cantidad de usuarios máxima para salir
```

Ejemplo: el script espera a que el total de usuarios sea menor a 13 y entonces cierra la llamada automáticamente.
