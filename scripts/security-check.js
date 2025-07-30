#!/usr/bin/env node

/**
 * Script de verificación de seguridad para pre-commit hooks
 * Detecta credenciales y secretos en archivos que se van a committear
 */

const fs = require('fs');
const path = require('path');

// Patrones peligrosos que indican credenciales
const DANGEROUS_PATTERNS = [
  // URLs de base de datos con credenciales
  /postgresql:\/\/[^:]+:[^@]+@[^\/]+\/[^?\s]+/gi,
  /mongodb:\/\/[^:]+:[^@]+@[^\/]+\/[^?\s]+/gi,
  /redis:\/\/[^:]+:[^@]+@[^\/]+\/[^?\s]+/gi,
  /mysql:\/\/[^:]+:[^@]+@[^\/]+\/[^?\s]+/gi,

  // Patrones de secretos
  /password\s*=\s*['"`][^'"`]{8,}['"`]/gi,
  /secret\s*=\s*['"`][^'"`]{8,}['"`]/gi,
  /api_key\s*=\s*['"`][^'"`]{8,}['"`]/gi,
  /token\s*=\s*['"`][^'"`]{8,}['"`]/gi,

  // Patrones específicos de nuestro proyecto
  /DATABASE_URL\s*=\s*['"`]postgresql:\/\/[^'"`]+['"`]/gi,
  /JWT_SECRET\s*=\s*['"`][^'"`]{16,}['"`]/gi,
  /COOKIE_SECRET\s*=\s*['"`][^'"`]{16,}['"`]/gi,
];

// Archivos que NO deben contener credenciales
const SENSITIVE_FILES = [
  '.env',
  '.env.local',
  '.env.production',
  '.env.staging',
];

// Extensiones de archivos a verificar
const CHECKED_EXTENSIONS = [
  '.ts',
  '.js',
  '.json',
  '.md',
  '.yml',
  '.yaml',
  '.txt',
];

// Archivos y directorios a ignorar
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.next',
  '.nuxt',
  'test/factories',
  'scripts/remove-credentials',
];

/**
 * Verifica si un archivo debe ser ignorado
 */
function shouldIgnoreFile(filePath) {
  return IGNORE_PATTERNS.some(
    pattern =>
      filePath.includes(pattern) || path.basename(filePath).startsWith(pattern),
  );
}

/**
 * Verifica si un archivo tiene una extensión que debe ser revisada
 */
function shouldCheckFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return (
    CHECKED_EXTENSIONS.includes(ext) ||
    SENSITIVE_FILES.includes(path.basename(filePath))
  );
}

/**
 * Busca patrones peligrosos en el contenido de un archivo
 */
function findDangerousPatterns(content, filePath) {
  const issues = [];

  DANGEROUS_PATTERNS.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        // Verificar si no es un ejemplo o placeholder
        if (!isExampleOrPlaceholder(match)) {
          issues.push({
            file: filePath,
            pattern: pattern.toString(),
            match: maskSensitiveData(match),
            line: findLineNumber(content, match),
          });
        }
      });
    }
  });

  return issues;
}

/**
 * Verifica si un match es un ejemplo o placeholder
 */
function isExampleOrPlaceholder(match) {
  const placeholderPatterns = [
    /user:password/,
    /your-.*-here/,
    /placeholder/,
    /example/,
    /dummy/,
    /fake/,
    /test/,
    /dev-.*-only/,
  ];

  return placeholderPatterns.some(pattern => pattern.test(match));
}

/**
 * Enmascara datos sensibles para mostrar en el output
 */
function maskSensitiveData(data) {
  return data.replace(/([^:]+):([^@]+)@/, '$1:***@');
}

/**
 * Encuentra el número de línea donde aparece el match
 */
function findLineNumber(content, match) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(match)) {
      return i + 1;
    }
  }
  return 'unknown';
}

/**
 * Función principal de verificación
 */
function checkSecurity() {
  console.log('🔍 Verificando seguridad de archivos...\n');

  const stagedFiles = getStagedFiles();
  let totalIssues = 0;

  stagedFiles.forEach(filePath => {
    if (shouldIgnoreFile(filePath)) {
      return;
    }

    if (!shouldCheckFile(filePath)) {
      return;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const issues = findDangerousPatterns(content, filePath);

      if (issues.length > 0) {
        console.log(`❌ ${filePath}:`);
        issues.forEach(issue => {
          console.log(`   Línea ${issue.line}: ${issue.match}`);
        });
        console.log('');
        totalIssues += issues.length;
      }
    } catch (error) {
      console.log(`⚠️  No se pudo leer ${filePath}: ${error.message}`);
    }
  });

  if (totalIssues > 0) {
    console.log(`🚨 Se encontraron ${totalIssues} problemas de seguridad!`);
    console.log('❌ Commit bloqueado por razones de seguridad.');
    console.log(
      '💡 Revisa los archivos y elimina las credenciales hardcodeadas.',
    );
    process.exit(1);
  } else {
    console.log('✅ No se encontraron problemas de seguridad.');
    console.log('✅ Commit permitido.');
  }
}

/**
 * Obtiene los archivos staged para commit
 */
function getStagedFiles() {
  try {
    const { execSync } = require('child_process');
    const output = execSync('git diff --cached --name-only', {
      encoding: 'utf8',
    });
    return output.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.log('⚠️  No se pudieron obtener archivos staged:', error.message);
    return [];
  }
}

// Ejecutar verificación si se llama directamente
if (require.main === module) {
  checkSecurity();
}

module.exports = { checkSecurity, findDangerousPatterns };
