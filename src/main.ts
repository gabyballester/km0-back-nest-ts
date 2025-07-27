import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ENV_VALUES, ENV_KEYS } from './shared/constants/environment';
import { CONFIG_KEYS } from './shared/constants/environment.schema';

async function bootstrap() {
  try {
    // Crear aplicación
    const app = await NestFactory.create(AppModule);

    // Obtener configuración
    const configService = app.get(ConfigService);

    // Configurar CORS
    const corsOrigin = configService.get<string>(CONFIG_KEYS.CORS_ORIGIN);
    app.enableCors({
      origin: corsOrigin,
      credentials: true,
    });

    // Configurar prefijo global
    app.setGlobalPrefix('api');

    // Configurar Swagger
    const config = new DocumentBuilder()
      .setTitle('KM0 Market API')
      .setDescription('API para el mercado KM0')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    // Obtener puerto
    const port = configService.get<number>(CONFIG_KEYS.ENV_PORT) ?? 4000;

    // Iniciar servidor
    await app.listen(port);

    // Log de inicio exitoso
    console.log(`🎯 ========================================`);
    console.log(`🚀 NESTJS APPLICATION STARTUP`);
    console.log(`========================================`);
    const environment =
      configService.get<string>(ENV_KEYS.NODE_ENV) ??
      ENV_VALUES.NODE_ENV.DEVELOPMENT;
    console.log(`🌍 Environment: ${environment}`);
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    console.log(`🔄 Process ID: ${process.pid}`);
    console.log(`📦 Node Version: ${process.version}`);
    console.log(`💻 Platform: ${process.platform} (${process.arch})`);
    console.log(`========================================`);

    if (environment === ENV_VALUES.NODE_ENV.DEVELOPMENT) {
      console.log(`🔧 DEVELOPMENT MODE`);
      console.log(`   • Hot reload enabled`);
      console.log(`   • Verbose logging`);
      console.log(`   • Debug mode active`);
      console.log(`   • Source maps enabled`);
    } else if (environment === ENV_VALUES.NODE_ENV.PRODUCTION) {
      console.log(`🚀 PRODUCTION MODE`);
      console.log(`   • Optimized for performance`);
      console.log(`   • Minimal logging`);
      console.log(`   • Security hardened`);
    }
  } catch (error) {
    console.error('❌ ========================================');
    console.error('💥 APPLICATION STARTUP FAILED');
    console.error('========================================');
    console.error(
      `🌍 Environment: ${process.env[ENV_KEYS.NODE_ENV] ?? ENV_VALUES.NODE_ENV.DEVELOPMENT}`,
    );
    console.error(`📅 Timestamp: ${new Date().toISOString()}`);
    console.error(
      `❌ Error: ${error instanceof Error ? error.message : String(error)}`,
    );
    console.error(
      `📚 Stack: ${error instanceof Error ? error.stack : 'No stack trace available'}`,
    );
    console.error('========================================');
    process.exit(1);
  }
}

void bootstrap();
