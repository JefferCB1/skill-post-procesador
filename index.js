#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const GRID_SIZE = 50;

function snapToGrid(value) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

function distance(point1, point2) {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function getElementCenter(element) {
  if (element.type === 'arrow') {
    return {
      x: element.x,
      y: element.y
    };
  }
  
  const width = element.width || 0;
  const height = element.height || 0;
  
  return {
    x: element.x + width / 2,
    y: element.y + height / 2
  };
}

function getArrowPoints(element) {
  const startPoint = {
    x: element.x,
    y: element.y
  };
  
  let endPoint;
  if (element.points && element.points.length > 1) {
    const lastPoint = element.points[element.points.length - 1];
    endPoint = {
      x: element.x + lastPoint[0],
      y: element.y + lastPoint[1]
    };
  } else {
    endPoint = startPoint;
  }
  
  return { startPoint, endPoint };
}

function optimizeExcalidraw(inputPath, outputPath) {
  console.log(`📂 Leyendo archivo: ${inputPath}`);
  
  const content = fs.readFileSync(inputPath, 'utf8');
  let data;
  
  try {
    data = JSON.parse(content);
  } catch (error) {
    console.error('❌ Error al parsear el JSON:', error.message);
    process.exit(1);
  }
  
  if (!data.elements) {
    console.error('❌ El archivo no contiene elementos de Excalidraw');
    process.exit(1);
  }
  
  const elements = data.elements;
  const originalCount = elements.length;
  
  console.log(`📊 Elementos encontrados: ${originalCount}`);
  
  const bindableElements = elements.filter(el => 
    ['rectangle', 'diamond', 'ellipse', 'icon', 'text', 'image'].includes(el.type)
  );
  
  const arrows = elements.filter(el => el.type === 'arrow');
  const freedrawElements = elements.filter(el => el.type === 'freedraw');
  
  console.log(`✏️  Flechas encontradas: ${arrows.length}`);
  console.log(`🎨 Trazos libres a eliminar: ${freedrawElements.length}`);
  
  let gridAlignedCount = 0;
  let arrowsBound = 0;
  let freedrawRemoved = 0;
  
  const processedElements = elements.map(element => {
    if (element.type === 'freedraw') {
      freedrawRemoved++;
      return null;
    }
    
    if (['rectangle', 'diamond', 'ellipse', 'icon', 'text', 'image', 'arrow', 'line'].includes(element.type)) {
      const oldX = element.x;
      const oldY = element.y;
      
      element.x = snapToGrid(element.x);
      element.y = snapToGrid(element.y);
      
      if (element.x !== oldX || element.y !== oldY) {
        gridAlignedCount++;
      }
      
      if (element.type === 'arrow' && element.points) {
        element.points = element.points.map(point => [
          snapToGrid(point[0]),
          snapToGrid(point[1])
        ]);
      }
    }
    
    return element;
  }).filter(el => el !== null);
  
  const finalElements = processedElements.map(element => {
    if (element.type === 'arrow') {
      if (!element.startBinding || !element.endBinding) {
        const { startPoint, endPoint } = getArrowPoints(element);
        
        let closestStart = null;
        let closestStartDist = Infinity;
        
        for (const target of bindableElements) {
          if (target.id === element.id) continue;
          
          const center = getElementCenter(target);
          const dist = distance(startPoint, center);
          
          if (dist < closestStartDist) {
            closestStartDist = dist;
            closestStart = target;
          }
        }
        
        let closestEnd = null;
        let closestEndDist = Infinity;
        
        for (const target of bindableElements) {
          if (target.id === element.id) continue;
          
          const center = getElementCenter(target);
          const dist = distance(endPoint, center);
          
          if (dist < closestEndDist) {
            closestEndDist = dist;
            closestEnd = target;
          }
        }
        
        const BINDING_THRESHOLD = 150;
        
        if (!element.startBinding && closestStart && closestStartDist < BINDING_THRESHOLD) {
          element.startBinding = {
            elementId: closestStart.id
          };
          arrowsBound++;
        }
        
        if (!element.endBinding && closestEnd && closestEndDist < BINDING_THRESHOLD) {
          element.endBinding = {
            elementId: closestEnd.id
          };
          arrowsBound++;
        }
      }
    }
    
    return element;
  });
  
  data.elements = finalElements;
  
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
  
  console.log('\n✅ Optimización completada:');
  console.log(`   ├── Grid alignment: ${gridAlignedCount} elementos ajustados`);
  console.log(`   ├── Flechas vinculadas: ${arrowsBound} uniones`);
  console.log(`   ├── Trazos eliminados: ${freedrawRemoved}`);
  console.log(`   └── Elementos finales: ${finalElements.length} (antes: ${originalCount})`);
  console.log(`\n💾 Archivo guardado: ${outputPath}`);
  
  return data;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎯 Excalidraw Optimizer - Skill para QC de diagramas

Usage:
  excalidraw-optimizer <input-file> [output-file]

Options:
  -o, --output <file>    Archivo de salida
  -h, --help            Mostrar ayuda

Ejemplos:
  excalidraw-optimizer diagrama.excalidraw
  excalidraw-optimizer input.excalidraw -o output.excalidraw
  excalidraw-optimizer input.excalidraw output.excalidraw
`);
    process.exit(0);
  }
  
  const inputPath = args[0];
  let outputPath = args[1] || inputPath.replace('.excalidraw', '.optimized.excalidraw');
  
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Archivo no encontrado: ${inputPath}`);
    process.exit(1);
  }
  
  optimizeExcalidraw(inputPath, outputPath);
}

module.exports = { optimizeExcalidraw, snapToGrid, distance };
