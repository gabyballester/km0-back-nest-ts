import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ENV_KEYS } from './config/env.constants';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');

  try {
    // Create the application (Zod validation happens in envConfig)
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // If we reach here, all environment variables are valid (Zod validated)
    logger.log('✅ Environment variables validated successfully');

    // Get configuration (Zod guarantees these are not null/undefined)
    const port = configService.get<number>(ENV_KEYS.PORT);
    const host = configService.get<string>(ENV_KEYS.HOST);
    const nodeEnv = configService.get<string>(ENV_KEYS.NODE_ENV);

    if (!port || !host || !nodeEnv) {
      throw new Error('Required configuration values are missing');
    }

    // Start server
    await app.listen(port);

    // Success log
    logger.log(`🚀 Server running on http://${host}:${port} (${nodeEnv})`);
    logger.log(`📊 Health: http://${host}:${port}/health`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logger.error(`❌ Startup failed: ${errorMessage}`);
    process.exit(1);
  }
}

void bootstrap();
