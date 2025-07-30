module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  // Configuración específica para evitar compilación
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },

  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            decorators: true,
          },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
          },
          target: 'es2020',
        },
        // Optimizaciones de SWC para velocidad
        minify: false,
        sourceMaps: false,
      },
    ],
  },
  // Configuración alternativa con esbuild (más rápido)
  transformIgnorePatterns: process.env.JEST_USE_ESBUILD
    ? ['node_modules/(?!(.*\\.mjs$))']
    : ['/node_modules/', '/dist/', '/legacy/', '/scripts/'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/**/*.d.ts',
    '!src/**/*.module.ts',
    '!src/**/index.ts',
    '!scripts/**/*',
    '!test/**/*',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**',
  ],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    // Archivos de configuración y setup (NO deberían testearse)
    '/main.ts$',
    '/app.module.ts$',
    '/app.controller.ts$',
    '/app.service.ts$',
    '/env.config.ts$',
    '/env.schema.ts$',

    // Health check (endpoints básicos - NO deberían testearse)
    '/health/',

    // Archivos de base de datos (se testean en integración)
    '/infrastructure/database/database.module.ts$',
    '/infrastructure/database/prisma.service.ts$',
    '/infrastructure/database/interfaces/',
    '/infrastructure/database/adapters/',
    '/infrastructure/database/schemas/',
    '/infrastructure/database/factory/',

    // Archivos de presentación (se testean en E2E)
    '/modules/users/presentation/',

    // Archivos de repositorios (se testean en integración)
    '/modules/users/infrastructure/repositories/',

    // Archivos de módulos (solo configuración - NO deberían testearse)
    '/modules/users/user.module.ts$',
    '/modules/security/security.module.ts$',

    // Constantes y tipos (solo definiciones - NO deberían testearse)
    '/shared/constants/',
    '/shared/types/',

    // Archivos de ejemplo (no son parte del core)
    '/modules/example/',

    // Archivos de build
    '/dist/',
    '/node_modules/',
  ],
  coverageThreshold: process.env.JEST_COVERAGE_THRESHOLD
    ? JSON.parse(process.env.JEST_COVERAGE_THRESHOLD)
    : {
        global: {
          branches: 80,
          functions: 90,
          lines: 90,
          statements: 90,
        },
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
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/legacy/', '/scripts/'],
  // Configuración para SWC
  extensionsToTreatAsEsm: [],
  globals: {},
  // Configuración de cobertura (solo cuando se necesita)
  coverageReporters: process.env.JEST_COVERAGE ? ['text', 'lcov', 'json'] : [],
  collectCoverage: process.env.JEST_COVERAGE === 'true',
  // Optimizaciones adicionales
  clearMocks: false, // Deshabilitar para velocidad
  resetMocks: false, // Deshabilitar para velocidad
  restoreMocks: false, // Deshabilitar para velocidad
  // Optimizaciones de velocidad extrema
  detectOpenHandles: false, // Deshabilitar para velocidad
  forceExit: true, // Forzar salida para velocidad
  // Optimizaciones adicionales
  maxConcurrency: 10,
  // Configuración para evitar conflictos con legacy
  haste: {
    throwOnModuleCollision: false,
    enableSymlinks: false,
  },
  // Deshabilitar el mapeo de Haste completamente
  modulePathIgnorePatterns: ['/legacy/'],
  // Configuración de resolución de módulos
  moduleDirectories: ['node_modules'],
  // Configuración de alias para rutas
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/config/(.*)$': '<rootDir>/src/config/$1',
    '^@/shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@/modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@/infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@/health/(.*)$': '<rootDir>/src/health/$1',
    '^@/test/(.*)$': '<rootDir>/test/$1',
    '^@/docs/(.*)$': '<rootDir>/docs/$1',
    // Removido mapeo de scripts para evitar compilación
  },
  // Optimizaciones adicionales para Node.js 22
  injectGlobals: true,
  // Configuración para evitar archivos temporales
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  // Directorio de trabajo temporal
  cacheDirectory: '.jest-cache',
  // Configuración para evitar archivos de salida
  setupFilesAfterEnv: [],
  // Excluir scripts de transformación
  transformIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/legacy/',
    '/scripts/',
  ],
  // Configuración específica para evitar compilación
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
};
