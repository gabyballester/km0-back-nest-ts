#!/usr/bin/env node

/**
 * Script para analizar la eficiencia de todos los scripts del proyecto
 * Uso: node scripts/analyze-scripts.js
 */

const fs = require('fs');
const path = require('path');

const SCRIPTS_DIR = path.join(__dirname);

function analyzeScript(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const stats = {
    file: path.basename(filePath),
    lines: lines.length,
    size: fs.statSync(filePath).size,
    hasShebang: lines[0]?.startsWith('#!/usr/bin/env node'),
    hasErrorHandling: content.includes('try') && content.includes('catch'),
    hasLogging:
      content.includes('console.log') || content.includes('console.error'),
    hasAsync: content.includes('async') || content.includes('Promise'),
    hasChildProcess: content.includes('execSync') || content.includes('spawn'),
    hasFileSystem:
      content.includes('fs.readFileSync') ||
      content.includes('fs.writeFileSync'),
    hasPath: content.includes('path.join') || content.includes('path.resolve'),
    efficiency: 'good',
    issues: [],
    recommendations: [],
  };

  // Análisis de eficiencia
  if (stats.lines > 200) {
    stats.efficiency = 'needs-review';
    stats.issues.push('Script muy largo (>200 líneas)');
    stats.recommendations.push('Considerar dividir en módulos más pequeños');
  }

  if (!stats.hasShebang) {
    stats.efficiency = 'needs-review';
    stats.issues.push('Falta shebang');
    stats.recommendations.push('Agregar #!/usr/bin/env node');
  }

  if (!stats.hasErrorHandling) {
    stats.efficiency = 'needs-review';
    stats.issues.push('Falta manejo de errores');
    stats.recommendations.push('Agregar try-catch blocks');
  }

  if (stats.hasChildProcess && !stats.hasErrorHandling) {
    stats.efficiency = 'needs-review';
    stats.issues.push('Comandos externos sin manejo de errores');
    stats.recommendations.push('Agregar try-catch para execSync/spawn');
  }

  if (stats.hasFileSystem && !stats.hasErrorHandling) {
    stats.efficiency = 'needs-review';
    stats.issues.push('Operaciones de archivo sin manejo de errores');
    stats.recommendations.push('Agregar try-catch para operaciones fs');
  }

  return stats;
}

function main() {
  console.log('🔍 Analizando eficiencia de scripts...\n');

  const scriptFiles = fs
    .readdirSync(SCRIPTS_DIR)
    .filter(file => file.endsWith('.js') && file !== 'analyze-scripts.js');

  const analysis = scriptFiles.map(file =>
    analyzeScript(path.join(SCRIPTS_DIR, file)),
  );

  // Mostrar resumen
  console.log('📊 RESUMEN DE ANÁLISIS\n');
  console.log(`Total de scripts: ${analysis.length}`);

  const goodScripts = analysis.filter(s => s.efficiency === 'good').length;
  const needsReview = analysis.filter(
    s => s.efficiency === 'needs-review',
  ).length;

  console.log(`✅ Scripts eficientes: ${goodScripts}`);
  console.log(`⚠️  Scripts que necesitan revisión: ${needsReview}\n`);

  // Mostrar análisis detallado
  analysis.forEach(script => {
    const status = script.efficiency === 'good' ? '✅' : '⚠️';
    console.log(`${status} ${script.file}`);
    console.log(
      `   Líneas: ${script.lines} | Tamaño: ${(script.size / 1024).toFixed(1)}KB`,
    );

    if (script.issues.length > 0) {
      console.log(`   Problemas: ${script.issues.join(', ')}`);
    }

    if (script.recommendations.length > 0) {
      console.log(`   Recomendaciones: ${script.recommendations.join(', ')}`);
    }
    console.log('');
  });

  // Mostrar estadísticas generales
  console.log('📈 ESTADÍSTICAS GENERALES\n');

  const totalLines = analysis.reduce((sum, s) => sum + s.lines, 0);
  const totalSize = analysis.reduce((sum, s) => sum + s.size, 0);
  const avgLines = Math.round(totalLines / analysis.length);
  const avgSize = Math.round(totalSize / analysis.length);

  console.log(`Líneas totales: ${totalLines} (promedio: ${avgLines})`);
  console.log(
    `Tamaño total: ${(totalSize / 1024).toFixed(1)}KB (promedio: ${(avgSize / 1024).toFixed(1)}KB)`,
  );

  const scriptsWithChildProcess = analysis.filter(
    s => s.hasChildProcess,
  ).length;
  const scriptsWithFileSystem = analysis.filter(s => s.hasFileSystem).length;

  console.log(`Scripts con procesos externos: ${scriptsWithChildProcess}`);
  console.log(`Scripts con operaciones de archivo: ${scriptsWithFileSystem}`);

  // Mostrar recomendaciones generales
  if (needsReview > 0) {
    console.log('\n🚨 RECOMENDACIONES GENERALES\n');
    console.log('1. Agregar manejo de errores a todos los scripts');
    console.log('2. Verificar que todos los scripts tengan shebang');
    console.log('3. Considerar dividir scripts muy largos');
    console.log('4. Agregar logging consistente');
    console.log('5. Optimizar operaciones de archivo y procesos externos');
  } else {
    console.log('\n✅ Todos los scripts están bien optimizados');
  }
}

if (require.main === module) {
  main();
}

module.exports = { analyzeScript, main };
