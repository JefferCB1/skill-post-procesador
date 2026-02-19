# skill-excalidraw-linker

Skill de control de calidad para archivos Excalidraw. Optimiza diagramas automáticamente mediante grid alignment, auto-binding de flechas y limpieza de trazos inútiles.

## Características

- **Grid Alignment**: Redondea coordenadas x/y a múltiplos de 50px
- **Auto-Binding**: Conecta automáticamente flechas a figuras cercanas
- **Limpieza**: Elimina trazos libre (freedraw) que inflan el archivo

## Instalación

```bash
npm install -g skill-excalidraw-linker
```

## Uso como CLI

```bash
# Optimizar archivo
excalidraw-optimizer diagrama.excalidraw

# Especificar archivo de salida
excalidraw-optimizer input.excalidraw -o output.excalidraw

# Versión corta
excalidraw-optimizer input.excalidraw output.excalidraw
```

## Uso como módulo Node

```javascript
const { optimizeExcalidraw } = require('skill-excalidraw-linker');

optimizeExcalidraw('input.excalidraw', 'output.excalidraw');
```

## Uso con npx (sin instalación)

```bash
npx skill-excalidraw-linker diagrama.excalidraw
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
