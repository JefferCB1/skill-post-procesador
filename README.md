# skill-post-procesador

Skill de control de calidad para archivos Excalidraw. Optimiza diagramas automáticamente.

## Uso

```bash
npx skill-post-procesador diagrama.excalidraw
```

Esto crea un archivo `diagrama.optimized.excalidraw` con:
- Grid alignment (coordenadas a múltiplos de 50px)
- Auto-binding de flechas a figuras cercanas
- Eliminación de trazos libre (freedraw)
