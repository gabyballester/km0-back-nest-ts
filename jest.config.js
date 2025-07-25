module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',

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
      },
    ],
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: [
    '/main.ts$',
    '/env.config.ts$',
    '/env.schema.ts$',
    '/env.constants.ts$',
    '/modules/security/security.module.ts$',
    '/shared/utils/environment-logger.ts$',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testEnvironment: 'node',
  // Optimizaciones para velocidad máxima
  maxWorkers: '100%',
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
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  // Configuración para SWC
  extensionsToTreatAsEsm: [],
  globals: {},
  // Configuración de cobertura
  coverageReporters: ['text', 'lcov', 'json'],
  collectCoverage: true,
  // Optimizaciones adicionales
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  // Optimizaciones de velocidad extrema
  detectOpenHandles: true,
  forceExit: false,
  // Optimizaciones adicionales
  maxConcurrency: 10,
};
