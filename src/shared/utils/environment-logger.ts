import { Logger } from '@nestjs/common';
import { ENV_VALUES } from '@/shared/constants/environment';

/**
 * Custom logger for environment-specific information
 * Provides structured logging based on the current environment
 */
export class EnvironmentLogger extends Logger {
  private static instance: EnvironmentLogger;
  private environment: string = ENV_VALUES.NODE_ENV.DEVELOPMENT;

  constructor() {
    super('EnvironmentLogger');
  }

  initialize(environment: string): void {
    this.environment = environment;
  }

  static getInstance(): EnvironmentLogger {
    if (!EnvironmentLogger.instance) {
      EnvironmentLogger.instance = new EnvironmentLogger();
    }
    return EnvironmentLogger.instance;
  }

  /**
   * Log environment information
   */
  logEnvironmentInfo(): void {
    const timestamp = new Date().toISOString();
    const pid = process.pid;
    const nodeVersion = process.version;
    const platform = process.platform;
    const arch = process.arch;

    console.log('\n🎯 ========================================');
    console.log('🚀 NESTJS APPLICATION STARTUP');
    console.log('========================================');
    console.log(`🌍 Environment: ${this.environment.toUpperCase()}`);
    console.log(`📅 Timestamp: ${timestamp}`);
    console.log(`🔄 Process ID: ${pid}`);
    console.log(`📦 Node Version: ${nodeVersion}`);
    console.log(`💻 Platform: ${platform} (${arch})`);
    console.log('========================================\n');

    // Información específica por entorno
    this.logEnvironmentSpecificInfo();
  }

  /**
   * Muestra información específica según el entorno
   */
  private logEnvironmentSpecificInfo(): void {
    switch (this.environment) {
      case ENV_VALUES.NODE_ENV.DEVELOPMENT:
        console.log('🔧 DEVELOPMENT MODE');
        console.log('   • Hot reload enabled');
        console.log('   • Verbose logging');
        console.log('   • Debug mode active');
        console.log('   • Source maps enabled');
        break;

      case ENV_VALUES.NODE_ENV.PRODUCTION:
        console.log('🏭 PRODUCTION MODE');
        console.log('   • Performance optimized');
        console.log('   • Security enhanced');
        console.log('   • Minimal logging');
        console.log('   • Error tracking enabled');
        break;

      case ENV_VALUES.NODE_ENV.TEST:
        console.log('🧪 TEST MODE');
        console.log('   • Test database');
        console.log('   • Suppressed logging');
        console.log('   • Fast execution');
        console.log('   • Mock services active');
        break;

      default:
        console.log('⚠️  UNKNOWN ENVIRONMENT');
        break;
    }
    console.log('');
  }

  /**
   * Log de inicio de aplicación
   */
  logApplicationStart(port: number): void {
    console.log('✅ ========================================');
    console.log('🚀 APPLICATION STARTED SUCCESSFULLY');
    console.log('========================================');
    console.log(`🌐 Server: http://localhost:${port}`);
    console.log(`🌍 Environment: ${this.environment.toUpperCase()}`);
    console.log(`📊 Health: http://localhost:${port}/health`);
    console.log(`📚 API Docs: http://localhost:${port}/api`);
    console.log('========================================\n');
  }

  /**
   * Log de error de inicio
   */
  logStartupError(error: Error): void {
    console.error('\n❌ ========================================');
    console.error('💥 APPLICATION STARTUP FAILED');
    console.error('========================================');
    console.error(`🌍 Environment: ${this.environment.toUpperCase()}`);
    console.error(`📅 Timestamp: ${new Date().toISOString()}`);
    console.error(`❌ Error: ${error.message}`);
    console.error(`📚 Stack: ${error.stack}`);
    console.error('========================================\n');
  }

  /**
   * Obtiene el entorno actual
   */
  getCurrentEnvironment(): string {
    return this.environment;
  }

  /**
   * Verifica si estamos en un entorno específico
   */
  isEnvironment(
    env: (typeof ENV_VALUES.NODE_ENV)[keyof typeof ENV_VALUES.NODE_ENV],
  ): boolean {
    return this.environment === env;
  }
}
