# skill-post-procesador

Skill de control de calidad para archivos Excalidraw. Optimiza diagramas automáticamente mediante grid alignment, auto-binding de flechas y limpieza de trazos inútiles.

## Instalación y Uso (npx)

```bash
# Optimizar archivo
npx skill-post-procesador diagrama.excalidraw

# Con archivo de salida
npx skill-post-procesador input.excalidraw -o output.excalidraw
npx skill-post-procesador input.excalidraw output.excalidraw
```

## Características

- **Grid Alignment**: Redondea coordenadas x/y a múltiplos de 50px
- **Auto-Binding**: Conecta automáticamente flechas a figuras cercanas
- **Limpieza**: Elimina trazos libre (freedraw) que inflan el archivo

## Uso como módulo Node

```javascript
const { optimizeExcalidraw } = require('skill-post-procesador');

optimizeExcalidraw('input.excalidraw', 'output.excalidraw');
```

## Funciones

### 1. Grid Alignment
Escanea todos los elementos y redondea sus coordenadas a múltiplos de 50px (snap to grid).

### 2. Auto-Binding
Para cada flecha sin bindings:
- Calcula la figura más cercana al punto de inicio
- Calcula la figura más cercana al punto final
- Inyecta los IDs en `startBinding` y `endBinding`

Umbral de distancia: 150px

### 3. Limpieza de Trazos
Elimina todos los elementos tipo `freedraw` para reducir drásticamente el tamaño del archivo.
