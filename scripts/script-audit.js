#!/usr/bin/env node

/**
 * 🧹 Script de Auditoría - Análisis Exhaustivo de Scripts
 *
 * Este script analiza todos los scripts del proyecto para identificar:
 * - Scripts redundantes o duplicados
 * - Scripts obsoletos o no utilizados
 * - Scripts que pueden ser consolidados
 * - Scripts que generan ruido innecesario
 */

const fs = require('fs');
const path = require('path');

// Categorías de scripts
const SCRIPT_CATEGORIES = {
  DIST_MANAGEMENT: 'Gestión de carpetas dist',
  DATABASE: 'Base de datos',
  MIGRATION: 'Migraciones',
  VALIDATION: 'Validaciones',
  TESTING: 'Testing',
  DEPLOYMENT: 'Deployment',
  UTILITIES: 'Utilidades',
  SAFETY: 'Seguridad',
  ANALYSIS: 'Análisis',
  SETUP: 'Configuración',
};

// Análisis de cada script
const SCRIPT_ANALYSIS = {
  // === GESTIÓN DE CARPETAS DIST ===
  'check-dist-folders.js': {
    category: SCRIPT_CATEGORIES.DIST_MANAGEMENT,
    status: 'ACTIVE',
    purpose: 'Detectar carpetas dist innecesarias',
    usage: 'npm run check:dist',
    essential: true,
    notes: 'Script principal para detección de dist folders',
  },
  'clean-unnecessary-dist.js': {
    category: SCRIPT_CATEGORIES.DIST_MANAGEMENT,
    status: 'ACTIVE',
    purpose: 'Limpiar carpetas dist innecesarias',
    usage: 'npm run clean:unnecessary-dist',
    essential: true,
    notes: 'Script principal para limpieza de dist folders',
  },
  'clean-dist.js': {
    category: SCRIPT_CATEGORIES.DIST_MANAGEMENT,
    status: 'REDUNDANT',
    purpose: 'Limpiar todas las carpetas dist',
    usage: 'npm run clean:dist',
    essential: false,
    notes: 'Redundante con clean-unnecessary-dist.js - más agresivo',
  },
  'dist-generation-tracker.js': {
    category: SCRIPT_CATEGORIES.DIST_MANAGEMENT,
    status: 'OBSOLETE',
    purpose: 'Rastrear generación de carpetas dist',
    usage: 'npm run track:dist',
    essential: false,
    notes: 'Ya no necesario - problema resuelto',
  },
  'test-dist-generation.js': {
    category: SCRIPT_CATEGORIES.DIST_MANAGEMENT,
    status: 'OBSOLETE',
    purpose: 'Probar generación de carpetas dist',
    usage: 'npm run test:dist',
    essential: false,
    notes: 'Ya no necesario - problema resuelto',
  },
  'exhaustive-dist-analysis.js': {
    category: SCRIPT_CATEGORIES.DIST_MANAGEMENT,
    status: 'OBSOLETE',
    purpose: 'Análisis exhaustivo de carpetas dist',
    usage: 'npm run analyze:dist',
    essential: false,
    notes: 'Ya no necesario - problema resuelto',
  },
  'aggressive-dist-detector.js': {
    category: SCRIPT_CATEGORIES.DIST_MANAGEMENT,
    status: 'OBSOLETE',
    purpose: 'Detección agresiva de carpetas dist',
    usage: 'npm run detect:dist',
    essential: false,
    notes: 'Ya no necesario - problema resuelto',
  },
  'test-all-package-scripts.js': {
    category: SCRIPT_CATEGORIES.DIST_MANAGEMENT,
    status: 'OBSOLETE',
    purpose: 'Probar todos los scripts de package.json',
    usage: 'npm run test:all-scripts',
    essential: false,
    notes: 'Ya no necesario - problema resuelto',
  },

  // === BASE DE DATOS ===
  'database-safety-guard.js': {
    category: SCRIPT_CATEGORIES.SAFETY,
    status: 'ACTIVE',
    purpose: 'Sistema de seguridad de base de datos',
    usage: 'npm run db:safety:*',
    essential: true,
    notes: 'Script crítico para protección de BD',
  },
  'db-manager.js': {
    category: SCRIPT_CATEGORIES.DATABASE,
    status: 'ACTIVE',
    purpose: 'Gestión de base de datos',
    usage: 'node scripts/db-manager.js',
    essential: true,
    notes: 'Script principal para gestión de BD',
  },
  'db-health.js': {
    category: SCRIPT_CATEGORIES.DATABASE,
    status: 'ACTIVE',
    purpose: 'Health check de base de datos',
    usage: 'npm run db:health',
    essential: true,
    notes: 'Script importante para monitoreo',
  },
  'db-backup.js': {
    category: SCRIPT_CATEGORIES.DATABASE,
    status: 'ACTIVE',
    purpose: 'Backup de base de datos',
    usage: 'npm run db:backup:*',
    essential: true,
    notes: 'Script crítico para backups',
  },
  'db-validate.js': {
    category: SCRIPT_CATEGORIES.DATABASE,
    status: 'ACTIVE',
    purpose: 'Validación de base de datos',
    usage: 'npm run db:validate',
    essential: true,
    notes: 'Script importante para validación',
  },
  'setup-db.js': {
    category: SCRIPT_CATEGORIES.SETUP,
    status: 'ACTIVE',
    purpose: 'Configuración inicial de BD',
    usage: 'npm run db:setup',
    essential: true,
    notes: 'Script importante para setup inicial',
  },
  'seed.js': {
    category: SCRIPT_CATEGORIES.DATABASE,
    status: 'ACTIVE',
    purpose: 'Seed de base de datos',
    usage: 'npm run db:seed',
    essential: true,
    notes: 'Script importante para datos de prueba',
  },
  'migrate-data.js': {
    category: SCRIPT_CATEGORIES.DATABASE,
    status: 'ACTIVE',
    purpose: 'Migración de datos',
    usage: 'node scripts/migrate-data.js',
    essential: true,
    notes: 'Script importante para migración de datos',
  },

  // === MIGRACIONES ===
  'migration-workflow.js': {
    category: SCRIPT_CATEGORIES.MIGRATION,
    status: 'ACTIVE',
    purpose: 'Workflow automatizado de migraciones',
    usage: 'npm run migration:workflow',
    essential: true,
    notes: 'Script principal para migraciones',
  },
  'migration-manager.js': {
    category: SCRIPT_CATEGORIES.MIGRATION,
    status: 'ACTIVE',
    purpose: 'Gestión de migraciones',
    usage: 'npm run migration:*',
    essential: true,
    notes: 'Script importante para gestión de migraciones',
  },

  // === VALIDACIONES ===
  'validate-staged.js': {
    category: SCRIPT_CATEGORIES.VALIDATION,
    status: 'REDUNDANT',
    purpose: 'Validación de archivos staged',
    usage: 'node scripts/validate-staged.js',
    essential: false,
    notes: 'Redundante - lint-staged ya maneja esto',
  },
  'validate-staged-light.js': {
    category: SCRIPT_CATEGORIES.VALIDATION,
    status: 'REDUNDANT',
    purpose: 'Validación ligera de archivos staged',
    usage: 'node scripts/validate-staged-light.js',
    essential: false,
    notes: 'Redundante - lint-staged ya maneja esto',
  },
  'test-quick-staged.js': {
    category: SCRIPT_CATEGORIES.TESTING,
    status: 'REDUNDANT',
    purpose: 'Tests rápidos para archivos staged',
    usage: 'node scripts/test-quick-staged.js',
    essential: false,
    notes: 'Redundante - lint-staged ya maneja esto',
  },
  'check-dependencies.js': {
    category: SCRIPT_CATEGORIES.VALIDATION,
    status: 'ACTIVE',
    purpose: 'Verificar dependencias',
    usage: 'npm run check:dependencies',
    essential: true,
    notes: 'Script importante para validación de dependencias',
  },
  'check-port-config.js': {
    category: SCRIPT_CATEGORIES.VALIDATION,
    status: 'ACTIVE',
    purpose: 'Verificar configuración de puertos',
    usage: 'npm run check:ports',
    essential: true,
    notes: 'Script importante para validación de configuración',
  },
  'check-ssl-config.js': {
    category: SCRIPT_CATEGORIES.VALIDATION,
    status: 'ACTIVE',
    purpose: 'Verificar configuración SSL',
    usage: 'npm run db:check:ssl',
    essential: true,
    notes: 'Script importante para validación SSL',
  },
  'check-process-env.js': {
    category: SCRIPT_CATEGORIES.VALIDATION,
    status: 'ACTIVE',
    purpose: 'Verificar variables de entorno',
    usage: 'node scripts/check-process-env.js',
    essential: true,
    notes: 'Script importante para validación de entorno',
  },
  'check-db-safety.js': {
    category: SCRIPT_CATEGORIES.SAFETY,
    status: 'REDUNDANT',
    purpose: 'Verificar seguridad de BD',
    usage: 'node scripts/check-db-safety.js',
    essential: false,
    notes: 'Redundante con database-safety-guard.js',
  },
  'check-deployment.js': {
    category: SCRIPT_CATEGORIES.VALIDATION,
    status: 'ACTIVE',
    purpose: 'Verificar configuración de deployment',
    usage: 'node scripts/check-deployment.js',
    essential: true,
    notes: 'Script importante para validación de deployment',
  },

  // === UTILIDADES ===
  'update-imports.js': {
    category: SCRIPT_CATEGORIES.UTILITIES,
    status: 'ACTIVE',
    purpose: 'Actualizar imports',
    usage: 'npm run update:imports',
    essential: true,
    notes: 'Script útil para mantenimiento',
  },
  'timed-run.js': {
    category: SCRIPT_CATEGORIES.UTILITIES,
    status: 'REDUNDANT',
    purpose: 'Ejecutar comandos con tiempo',
    usage: 'node scripts/timed-run.js',
    essential: false,
    notes: 'Funcionalidad ya incluida en otros scripts',
  },
  'prepare.js': {
    category: SCRIPT_CATEGORIES.SETUP,
    status: 'ACTIVE',
    purpose: 'Preparación del proyecto',
    usage: 'npm run prepare',
    essential: true,
    notes: 'Script importante para setup',
  },
  'constants.js': {
    category: SCRIPT_CATEGORIES.UTILITIES,
    status: 'ACTIVE',
    purpose: 'Constantes compartidas',
    usage: 'require("./constants.js")',
    essential: true,
    notes: 'Módulo compartido entre scripts',
  },

  // === ANÁLISIS ===
  'analyze-scripts.js': {
    category: SCRIPT_CATEGORIES.ANALYSIS,
    status: 'OBSOLETE',
    purpose: 'Analizar eficiencia de scripts',
    usage: 'node scripts/analyze-scripts.js',
    essential: false,
    notes: 'Ya no necesario - análisis completado',
  },

  // === DEPLOYMENT ===
  'production-deploy.js': {
    category: SCRIPT_CATEGORIES.DEPLOYMENT,
    status: 'REDUNDANT',
    purpose: 'Deployment de producción',
    usage: 'node scripts/production-deploy.js',
    essential: false,
    notes: 'Redundante con scripts de Prisma',
  },
  'production-deploy-utils.js': {
    category: SCRIPT_CATEGORIES.DEPLOYMENT,
    status: 'REDUNDANT',
    purpose: 'Utilidades de deployment',
    usage: 'require("./production-deploy-utils.js")',
    essential: false,
    notes: 'Redundante con scripts de Prisma',
  },
  'monitor-deployment.js': {
    category: SCRIPT_CATEGORIES.DEPLOYMENT,
    status: 'REDUNDANT',
    purpose: 'Monitoreo de deployment',
    usage: 'node scripts/monitor-deployment.js',
    essential: false,
    notes: 'Funcionalidad ya incluida en otros scripts',
  },
  'test-environments.js': {
    category: SCRIPT_CATEGORIES.TESTING,
    status: 'REDUNDANT',
    purpose: 'Probar entornos',
    usage: 'node scripts/test-environments.js',
    essential: false,
    notes: 'Funcionalidad ya incluida en otros scripts',
  },
  'setup-env.js': {
    category: SCRIPT_CATEGORIES.SETUP,
    status: 'REDUNDANT',
    purpose: 'Configurar entorno',
    usage: 'node scripts/setup-env.js',
    essential: false,
    notes: 'Funcionalidad ya incluida en otros scripts',
  },
};

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  console.log(`${colors.red}${colors.bright}❌ ${message}${colors.reset}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}${colors.bright}⚠️  ${message}${colors.reset}`);
}

function logSuccess(message) {
  console.log(`${colors.green}${colors.bright}✅ ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`${colors.blue}${colors.bright}ℹ️  ${message}${colors.reset}`);
}

function logSection(message) {
  console.log(
    `\n${colors.magenta}${colors.bright}📋 ${message}${colors.reset}`,
  );
  console.log(`${colors.white}${'─'.repeat(60)}${colors.reset}`);
}

function analyzeScripts() {
  const scriptsDir = path.join(__dirname);
  const scriptFiles = fs
    .readdirSync(scriptsDir)
    .filter(file => file.endsWith('.js'))
    .filter(file => file !== 'script-audit.js');

  const analysis = {
    total: scriptFiles.length,
    active: 0,
    redundant: 0,
    obsolete: 0,
    byCategory: {},
    recommendations: [],
  };

  // Inicializar contadores por categoría
  Object.values(SCRIPT_CATEGORIES).forEach(category => {
    analysis.byCategory[category] = {
      active: 0,
      redundant: 0,
      obsolete: 0,
      scripts: [],
    };
  });

  scriptFiles.forEach(file => {
    const scriptInfo = SCRIPT_ANALYSIS[file];

    if (scriptInfo) {
      const category = scriptInfo.category;
      const status = scriptInfo.status;

      analysis.byCategory[category][status.toLowerCase()]++;
      analysis.byCategory[category].scripts.push({
        file,
        ...scriptInfo,
      });

      if (status === 'ACTIVE') analysis.active++;
      else if (status === 'REDUNDANT') analysis.redundant++;
      else if (status === 'OBSOLETE') analysis.obsolete++;
    } else {
      logWarning(`Script no analizado: ${file}`);
    }
  });

  return analysis;
}

function generateRecommendations(analysis) {
  const recommendations = [];

  // Scripts redundantes
  if (analysis.redundant > 0) {
    recommendations.push({
      type: 'CLEANUP',
      priority: 'HIGH',
      title: 'Eliminar scripts redundantes',
      description: `${analysis.redundant} scripts son redundantes y pueden ser eliminados`,
      scripts: Object.values(analysis.byCategory)
        .flatMap(cat => cat.scripts)
        .filter(script => script.status === 'REDUNDANT')
        .map(script => script.file),
    });
  }

  // Scripts obsoletos
  if (analysis.obsolete > 0) {
    recommendations.push({
      type: 'CLEANUP',
      priority: 'HIGH',
      title: 'Eliminar scripts obsoletos',
      description: `${analysis.obsolete} scripts son obsoletos y pueden ser eliminados`,
      scripts: Object.values(analysis.byCategory)
        .flatMap(cat => cat.scripts)
        .filter(script => script.status === 'OBSOLETE')
        .map(script => script.file),
    });
  }

  // Consolidación de scripts de dist
  const distScripts = analysis.byCategory[SCRIPT_CATEGORIES.DIST_MANAGEMENT];
  if (distScripts && distScripts.scripts.length > 2) {
    recommendations.push({
      type: 'CONSOLIDATION',
      priority: 'MEDIUM',
      title: 'Consolidar scripts de gestión de dist',
      description:
        'Mantener solo check-dist-folders.js y clean-unnecessary-dist.js',
      scripts: distScripts.scripts
        .filter(script => script.status !== 'ACTIVE')
        .map(script => script.file),
    });
  }

  return recommendations;
}

function main() {
  console.log(
    `${colors.cyan}${colors.bright}🧹 AUDITORÍA EXHAUSTIVA DE SCRIPTS${colors.reset}`,
  );
  console.log(`${colors.white}${'='.repeat(60)}${colors.reset}\n`);

  const analysis = analyzeScripts();
  const recommendations = generateRecommendations(analysis);

  // Resumen general
  logSection('RESUMEN GENERAL');
  logInfo(`Total de scripts: ${analysis.total}`);
  logSuccess(`Scripts activos: ${analysis.active}`);
  logWarning(`Scripts redundantes: ${analysis.redundant}`);
  logError(`Scripts obsoletos: ${analysis.obsolete}`);

  // Análisis por categoría
  logSection('ANÁLISIS POR CATEGORÍA');
  Object.entries(analysis.byCategory).forEach(([category, data]) => {
    if (data.scripts.length > 0) {
      const total = data.active + data.redundant + data.obsolete;
      logInfo(`${category}: ${total} scripts`);

      if (data.active > 0) logSuccess(`  ✅ Activos: ${data.active}`);
      if (data.redundant > 0)
        logWarning(`  ⚠️  Redundantes: ${data.redundant}`);
      if (data.obsolete > 0) logError(`  ❌ Obsoletos: ${data.obsolete}`);
    }
  });

  // Scripts redundantes
  if (analysis.redundant > 0) {
    logSection('SCRIPTS REDUNDANTES');
    Object.values(analysis.byCategory)
      .flatMap(cat => cat.scripts)
      .filter(script => script.status === 'REDUNDANT')
      .forEach(script => {
        logWarning(`${script.file}`);
        logInfo(`  Propósito: ${script.purpose}`);
        logInfo(`  Nota: ${script.notes}`);
      });
  }

  // Scripts obsoletos
  if (analysis.obsolete > 0) {
    logSection('SCRIPTS OBSOLETOS');
    Object.values(analysis.byCategory)
      .flatMap(cat => cat.scripts)
      .filter(script => script.status === 'OBSOLETE')
      .forEach(script => {
        logError(`${script.file}`);
        logInfo(`  Propósito: ${script.purpose}`);
        logInfo(`  Nota: ${script.notes}`);
      });
  }

  // Recomendaciones
  logSection('RECOMENDACIONES');
  recommendations.forEach((rec, index) => {
    const priorityColor = rec.priority === 'HIGH' ? 'red' : 'yellow';
    log(`${index + 1}. ${rec.title}`, priorityColor);
    logInfo(`   ${rec.description}`);
    if (rec.scripts && rec.scripts.length > 0) {
      logInfo(`   Scripts afectados: ${rec.scripts.join(', ')}`);
    }
  });

  // Plan de acción
  logSection('PLAN DE ACCIÓN SUGERIDO');

  const scriptsToDelete = Object.values(analysis.byCategory)
    .flatMap(cat => cat.scripts)
    .filter(
      script => script.status === 'REDUNDANT' || script.status === 'OBSOLETE',
    )
    .map(script => script.file);

  if (scriptsToDelete.length > 0) {
    logInfo('Scripts a eliminar:');
    scriptsToDelete.forEach(script => {
      logError(`   rm scripts/${script}`);
    });

    logInfo('\nComando para eliminar todos:');
    log(`   rm scripts/{${scriptsToDelete.join(',')}}`, 'cyan');
  }

  // Scripts a mantener
  const scriptsToKeep = Object.values(analysis.byCategory)
    .flatMap(cat => cat.scripts)
    .filter(script => script.status === 'ACTIVE')
    .map(script => script.file);

  logInfo('\nScripts esenciales a mantener:');
  scriptsToKeep.forEach(script => {
    logSuccess(`   ✅ ${script}`);
  });

  console.log(
    `\n${colors.cyan}${colors.bright}🎯 AUDITORÍA COMPLETADA${colors.reset}`,
  );
  console.log(`${colors.white}${'='.repeat(60)}${colors.reset}`);
}

if (require.main === module) {
  main();
}

module.exports = { analyzeScripts, generateRecommendations, SCRIPT_ANALYSIS };
