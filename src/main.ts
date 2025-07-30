import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ENV_VALUES, ENV_KEYS } from '@/shared/constants/environment';

async function bootstrap() {
  try {
    // Crear aplicación
    const app = await NestFactory.create(AppModule);

    // Configurar pipe de validación global
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Obtener configuración
    const configService = app.get(ConfigService);

    // Configurar CORS
    const corsOrigin = configService.get<string>(ENV_KEYS.CORS_ORIGIN);
    app.enableCors({
      origin: corsOrigin,
      credentials: true,
    });

    // Configurar Swagger
    const config = new DocumentBuilder()
      .setTitle('KM0 Market API')
      .setDescription('API para el mercado KM0')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    // Obtener puerto y host
    const port = configService.get<number>(ENV_KEYS.PORT) ?? 4000;
    const host = configService.get<string>(ENV_KEYS.HOST) ?? 'localhost';
    // Iniciar servidor
    await app.listen(port, host);

    // Log de inicio exitoso
    console.log(`🎯 ========================================`);
    console.log(`🚀 NESTJS APPLICATION STARTUP`);
    console.log(`========================================`);
    const environment =
      configService.get<string>(ENV_KEYS.NODE_ENV) ??
      ENV_VALUES.NODE_ENV.DEVELOPMENT;
    console.log(`🌍 Environment: ${environment}`);
    console.log(`🔧 Port: ${port}`);
    console.log(`🏠 Host: ${host}`);
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    console.log(`🔄 Process ID: ${process.pid}`);
    console.log(`📦 Node Version: ${process.version}`);
    console.log(`💻 Platform: ${process.platform} (${process.arch})`);
    console.log(`========================================`);

    // Log específico para desarrollo
    if (environment === ENV_VALUES.NODE_ENV.DEVELOPMENT) {
      console.log(`🔧 DEVELOPMENT MODE`);
      console.log(`   • Hot reload enabled`);
      console.log(`   • Verbose logging`);
      console.log(`   • Debug mode active`);
      console.log(`   • Source maps enabled`);
    }
  } catch (error) {
    console.error('❌ ========================================');
    console.error('💥 APPLICATION STARTUP FAILED');
    console.error('========================================');
    const environment = process.env.NODE_ENV ?? ENV_VALUES.NODE_ENV.DEVELOPMENT;
    console.error(`🌍 Environment: ${environment}`);
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
