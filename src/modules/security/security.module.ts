import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENV_KEYS } from '../../config/env.constants';

/**
 * Security module that provides:
 * - Rate limiting (Throttler)
 * - Security headers (Helmet - applied globally)
 * - CORS configuration
 */
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService,
      ): {
        ttl: number;
        limit: number;
        skipIf: (req: { url: string }) => boolean;
      } => ({
        ttl: configService.get<number>(ENV_KEYS.THROTTLE_TTL),
        limit: configService.get<number>(ENV_KEYS.THROTTLE_LIMIT),
        // Skip rate limiting for health checks
        skipIf: (req: { url: string }) => req.url === '/health',
      }),
    }),
  ],
  exports: [ThrottlerModule],
})
export class SecurityModule {}
