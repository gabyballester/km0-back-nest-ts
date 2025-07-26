"use strict";

var _module$exports;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = (_module$exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  // Configuración específica para evitar compilación
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json'
    }
  },
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['@swc/jest', {
      jsc: {
        parser: {
          syntax: 'typescript',
          decorators: true
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true
        },
        target: 'es2020'
      },
      // Optimizaciones de SWC para velocidad
      minify: false,
      sourceMaps: false
    }]
  },
  // Configuración alternativa con esbuild (más rápido)
  transformIgnorePatterns: process.env.JEST_USE_ESBUILD ? ['node_modules/(?!(.*\\.mjs$))'] : ['/node_modules/', '/dist/', '/legacy/'],
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/main.ts$', '/env.config.ts$', '/env.schema.ts$', // Excluir toda la carpeta de constantes (solo definiciones estáticas, helpers y schemas)
  '/shared/constants/', // Excluir módulos puramente declarativos (sin lógica de negocio)
  '/modules/security/security.module.ts$', // Excluir adaptadores y schemas (no necesitan tests unitarios)
  '/infrastructure/database/adapters/', '/infrastructure/database/schemas/', '/infrastructure/database/factory/', '/dist/', '/node_modules/'],
  coverageThreshold: process.env.JEST_COVERAGE_THRESHOLD ? JSON.parse(process.env.JEST_COVERAGE_THRESHOLD) : {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testEnvironment: 'node',
  // Optimizaciones para velocidad máxima
  maxWorkers: process.env.JEST_MAX_WORKERS || '100%',
  bail: true,
  verbose: false,
  silent: true,
  // Cache para tests más rápidos
  cache: true,
  cacheDirectory: '.jest-cache',
  // Configuraciones adicionales para velocidad
  testTimeout: 2000,
  setupFilesAfterEnv: [],
  // Excluir archivos innecesarios
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/legacy/'],
  // Configuración para SWC
  extensionsToTreatAsEsm: []
}, _defineProperty(_module$exports, "globals", {}), _defineProperty(_module$exports, "coverageReporters", process.env.JEST_COVERAGE ? ['text', 'lcov', 'json'] : []), _defineProperty(_module$exports, "collectCoverage", process.env.JEST_COVERAGE === 'true'), _defineProperty(_module$exports, "clearMocks", false), _defineProperty(_module$exports, "resetMocks", false), _defineProperty(_module$exports, "restoreMocks", false), _defineProperty(_module$exports, "detectOpenHandles", false), _defineProperty(_module$exports, "forceExit", true), _defineProperty(_module$exports, "maxConcurrency", 10), _defineProperty(_module$exports, "haste", {
  throwOnModuleCollision: false,
  enableSymlinks: false
}), _defineProperty(_module$exports, "modulePathIgnorePatterns", ['/legacy/']), _defineProperty(_module$exports, "moduleDirectories", ['node_modules']), _defineProperty(_module$exports, "injectGlobals", true), _defineProperty(_module$exports, "testEnvironmentOptions", {
  url: 'http://localhost'
}), _defineProperty(_module$exports, "cacheDirectory", '.jest-cache'), _defineProperty(_module$exports, "setupFilesAfterEnv", []), _defineProperty(_module$exports, "globals", {
  'ts-jest': {
    tsconfig: 'tsconfig.test.json'
  }
}), _module$exports);