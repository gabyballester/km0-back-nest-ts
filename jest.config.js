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
    '^.+\\.(t|j)s$': [
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
    : ['/node_modules/', '/dist/', '/legacy/'],
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/main.ts$',
    '/env.config.ts$',
    '/env.schema.ts$',
    // Excluir toda la carpeta de constantes (solo definiciones estáticas, helpers y schemas)
    '/shared/constants/',
    // Excluir módulos puramente declarativos (sin lógica de negocio)
    '/modules/security/security.module.ts$',
    // Excluir adaptadores y schemas (no necesitan tests unitarios)
    '/infrastructure/database/adapters/',
    '/infrastructure/database/schemas/',
    '/infrastructure/database/factory/',
    '/dist/',
    '/node_modules/',
  ],
  coverageThreshold: process.env.JEST_COVERAGE_THRESHOLD
    ? JSON.parse(process.env.JEST_COVERAGE_THRESHOLD)
    : {
        global: {
          branches: 70,
          functions: 80,
          lines: 80,
          statements: 80,
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
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/legacy/'],
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
  // Configuración específica para evitar compilación
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
};
