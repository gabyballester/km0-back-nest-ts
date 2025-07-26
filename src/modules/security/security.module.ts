import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENV_KEYS } from '../../shared/constants/environment';

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
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get<number>(ENV_KEYS.THROTTLE_TTL) ?? 60,
            limit: configService.get<number>(ENV_KEYS.THROTTLE_LIMIT) ?? 100,
          },
        ],
        // Skip rate limiting for health checks
        skipIf: (context: {
          switchToHttp: () => { getRequest: () => { url: string } };
        }) => {
          const req = context.switchToHttp().getRequest();
          return req.url === '/health';
        },
      }),
    }),
  ],
  exports: [ThrottlerModule],
})
export class SecurityModule {}
