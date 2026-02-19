# Skill: Excalidraw Optimizer

Toma un archivo .excalidraw recién generado y lo optimiza para QC:

1. **Grid Alignment**: Redondea coordenadas x/y de todos los elementos a múltiplos de 50px
2. **Auto-Binding**: Conecta automáticamente flechas a figuras cercanas (rectangle, diamond, ellipse, icon, text)
3. **Limpieza**: Elimina elementos tipo freedraw que inflan el archivo

## Uso con npx

```bash
npx skill-post-procesador <archivo.excalidraw> [archivo-salida.excalidraw]

# Ejemplos
npx skill-post-procesador diagrama.excalidraw
npx skill-post-procesador input.excalidraw -o output.excalidraw
npx skill-post-procesador input.excalidraw output.excalidraw
```

## Uso como módulo

```javascript
const { optimizeExcalidraw } = require('skill-post-procesador');
optimizeExcalidraw('entrada.excalidraw', 'salida.excalidraw');
```
