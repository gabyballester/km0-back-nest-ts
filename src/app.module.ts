import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { SecurityModule } from '@/modules/security/security.module';
import { SecurityMiddleware } from '@/modules/security/security.middleware';
import { HealthController } from '@/health/health.controller';
import { DatabaseModule } from '@/infrastructure/database/database.module';
import { ExampleModule } from '@/modules/example/example.module';
import { UserModule } from '@/modules/users/user.module';
import { envConfig } from '@/config/env.config';

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
      // todo: esto es correcto? si se usa script con dotenv o cross-env
      envFilePath: ['.env', '.env.development', '.env.test'],
    }),
    // Security module (rate limiting, etc.)
    SecurityModule,
    // Database module with ORM abstraction
    DatabaseModule,
    // Example module for API versioning demonstration
    ExampleModule,
    // User module for user management
    UserModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {
  /**
   * Configure global middleware
   */
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(SecurityMiddleware).forRoutes('*');
  }
}
