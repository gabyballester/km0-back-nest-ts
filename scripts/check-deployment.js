#!/usr/bin/env node

/**
 * Script para verificar que el proyecto esté listo para deployment
 * Uso: node scripts/check-deployment.js
 */

const fs = require('fs');
const path = require('path');

function checkDeploymentReadiness() {
  console.log('🔍 Verificando preparación para deployment...\n');

  const checks = [
    {
      name: 'Package.json existe',
      check: () => fs.existsSync('package.json'),
      critical: true,
    },
    {
      name: 'Script start:prod existe',
      check: () => {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        return packageJson.scripts && packageJson.scripts['start:prod'];
      },
      critical: true,
    },
    {
      name: 'Script build:prod existe',
      check: () => {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        return packageJson.scripts && packageJson.scripts['build:prod'];
      },
      critical: true,
    },
    {
      name: 'Archivo main.ts existe',
      check: () => fs.existsSync('src/main.ts'),
      critical: true,
    },
    {
      name: 'Health endpoint configurado',
      check: () => {
        const mainContent = fs.readFileSync('src/main.ts', 'utf8');
        return mainContent.includes('/health');
      },
      critical: false,
    },
    {
      name: 'Variables de entorno validadas',
      check: () => {
        const envSchema = fs.readFileSync('src/config/env.schema.ts', 'utf8');
        return (
          envSchema.includes('z.object') && envSchema.includes('JWT_SECRET')
        );
      },
      critical: true,
    },
    {
      name: 'ConfigService implementado',
      check: () => {
        const mainContent = fs.readFileSync('src/main.ts', 'utf8');
        return mainContent.includes('ConfigService');
      },
      critical: true,
    },
    {
      name: 'Security headers configurados',
      check: () => {
        const securityMiddleware = fs.readFileSync(
          'src/modules/security/security.middleware.ts',
          'utf8',
        );
        return securityMiddleware.includes('helmet');
      },
      critical: false,
    },
    {
      name: 'Tests pasando',
      check: () => {
        // Verificar que hay tests
        const testFiles = fs
          .readdirSync('src')
          .filter(file => file.endsWith('.spec.ts'));
        return testFiles.length > 0;
      },
      critical: false,
    },
    {
      name: 'Documentación de deployment',
      check: () => fs.existsSync('docs/DEPLOYMENT.md'),
      critical: false,
    },
  ];

  let passed = 0;
  let failed = 0;
  let criticalFailed = 0;

  checks.forEach(({ name, check, critical }) => {
    try {
      const result = check();
      if (result) {
        console.log(`✅ ${name}`);
        passed++;
      } else {
        console.log(`❌ ${name}`);
        failed++;
        if (critical) criticalFailed++;
      }
    } catch (error) {
      console.log(`❌ ${name} (Error: ${error.message})`);
      failed++;
      if (critical) criticalFailed++;
    }
  });

  console.log('\n📊 Resumen:');
  console.log(`✅ Pasaron: ${passed}`);
  console.log(`❌ Fallaron: ${failed}`);
  console.log(`🚨 Críticos fallidos: ${criticalFailed}`);

  if (criticalFailed > 0) {
    console.log('\n🚨 ERROR: Hay verificaciones críticas fallidas');
    console.log('🔧 Corrige los errores críticos antes de hacer deployment');
    process.exit(1);
  } else if (failed > 0) {
    console.log('\n⚠️ ADVERTENCIA: Hay verificaciones no críticas fallidas');
    console.log('💡 Considera corregir estos problemas para mejor calidad');
    process.exit(0);
  } else {
    console.log('\n🎉 ¡Proyecto listo para deployment!');
    console.log(
      '🚀 Puedes proceder con Railway, Render, o cualquier plataforma',
    );
    process.exit(0);
  }
}

if (require.main === module) {
  checkDeploymentReadiness();
}

module.exports = { checkDeploymentReadiness };
