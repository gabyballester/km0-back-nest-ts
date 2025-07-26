import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentLogger } from './shared/utils/environment-logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ENV_VALUES, CONFIG_KEYS } from './shared/constants/environment';

async function bootstrap() {
  try {
    // Crear aplicación
    const app = await NestFactory.create(AppModule);

    // Obtener configuración
    const configService = app.get(ConfigService);
    const port = configService.get<number>(CONFIG_KEYS.ENV_PORT, 3000);
    const environment = configService.get<string>(
      CONFIG_KEYS.ENV_NODE_ENV,
      ENV_VALUES.NODE_ENV.DEVELOPMENT,
    );

    // Configurar Swagger
    const config = new DocumentBuilder()
      .setTitle('KM0 Market API')
      .setDescription(
        'API para el marketplace KM0 - Conectando productores locales con consumidores',
      )
      .setVersion('1.0')
      .addTag('health', 'Endpoints de monitoreo y health checks')
      .addTag('auth', 'Autenticación y autorización')
      .addTag('users', 'Gestión de usuarios')
      .addTag('products', 'Gestión de productos')
      .addTag('orders', 'Gestión de pedidos')
      .addServer(`http://localhost:${port}`, 'Servidor de desarrollo')
      .addServer('https://km0-market.onrender.com', 'Servidor de producción')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
      },
      customSiteTitle: 'KM0 Market API Documentation',
    });

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

void bootstrap();
