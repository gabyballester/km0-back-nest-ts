import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentLogger } from './shared/utils/environment-logger';

async function bootstrap() {
  try {
    // Crear aplicación
    const app = await NestFactory.create(AppModule);

    // Obtener configuración
    const configService = app.get(ConfigService);
    const port = configService.get<number>('env.port', 3000);
    const environment = configService.get<string>('env.nodeEnv', 'development');

    // Inicializar logger personalizado con el entorno correcto
    const envLogger = EnvironmentLogger.getInstance();
    envLogger.initialize(environment);

    // Mostrar información del entorno
    envLogger.logEnvironmentInfo();

    // Iniciar servidor
    await app.listen(port);

    // Mostrar información de inicio exitoso
    envLogger.logApplicationStart(port);
  } catch (error) {
    const envLogger = EnvironmentLogger.getInstance();
    envLogger.logStartupError(error as Error);
    process.exit(1);
  }
}

bootstrap().catch(error => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});
