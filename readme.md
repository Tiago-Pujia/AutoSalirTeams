# ¿Qué hace?
Cierra automáticamente la llamada de Teams cuando comienzan a irse los participantes.

# ¿Como utilizarlo?
1. Entra a la llamada desde el navegador.
2. Espera a que se unan los participantes.
3. Abre la consola del navegador (F12 o Ctrl+Shift+I).
4. Copia y pega el contenido de `main.js` y presiona Enter.

El script cierra la llamada cuando el número de usuarios baja de 15.

# ¿Cómo funciona?
El script utiliza un intervalo para verificar periódicamente el número de usuarios en la llamada. Si el número de usuarios es menor que el umbral establecido, cierra la llamada.

# ¿Como configurarlo?
Ajustas las variables globales:
```js
const USUARIOS_MAXIMO = 15; // Cantidad de usuarios maximos para irse
const INTERVALO_MS = 1000; // En milisegundos
```

Ejemplo: Cada 1000 milisegundos verifica si el número de usuarios es menor a 15, si es así, cierra la llamada.


