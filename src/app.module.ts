import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SecurityModule } from './modules/security/security.module';
import { SecurityMiddleware } from './modules/security/security.middleware';
import { HealthController } from './health/health.controller';
import { DatabaseModule } from './infrastructure/database/database.module';
import { envConfig } from './config/env.config';

/**
 * Root application module
 * Configures all core modules and middleware
 */
@Module({
  imports: [
    // Environment configuration with validation
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      cache: true,
      envFilePath: [
        '.env',
        '.env.local',
        `.env.${process.env.NODE_ENV ?? 'development'}`,
      ],
    }),
    // Security module (rate limiting, etc.)
    SecurityModule,
    // Database module with ORM abstraction
    DatabaseModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {
  /**
   * Configure global middleware
   */
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(SecurityMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
