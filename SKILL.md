# Skill: Excalidraw Linker

Toma un archivo .excalidraw recién generado y lo optimiza para QC:

1. **Grid Alignment**: Redondea coordenadas x/y de todos los elementos a múltiplos de 50px
2. **Auto-Binding**: Conecta automáticamente flechas a figuras cercanas (rectangle, diamond, ellipse, icon, text)
3. **Limpieza**: Elimina elementos tipo freedraw que inflan el archivo

Usa el script `excalidraw-optimizer` para procesar el archivo:

```bash
npx skill-excalidraw-linker <archivo.excalidraw> [archivo-salida.excalidraw]
```

O importar como módulo:

```javascript
const { optimizeExcalidraw } = require('skill-excalidraw-linker');
optimizeExcalidraw('entrada.excalidraw', 'salida.excalidraw');
```
