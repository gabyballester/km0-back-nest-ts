import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { ENV_KEYS } from '@/shared/constants/environment';

/**
 * Security middleware that applies:
 * - Helmet security headers
 * - CORS configuration
 * - Additional security measures
 */
@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private readonly helmetMiddleware: ReturnType<typeof helmet>;
  private readonly corsOrigin: string;

  constructor(private readonly configService: ConfigService) {
    const corsOrigin = this.configService.get<string>(ENV_KEYS.CORS_ORIGIN);
    this.corsOrigin = corsOrigin ?? 'http://localhost:3000';

    // Configure Helmet with security headers
    this.helmetMiddleware = helmet({
      // Content Security Policy
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      // Cross-Origin Embedder Policy
      crossOriginEmbedderPolicy: false,
      // Cross-Origin Opener Policy
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      // Cross-Origin Resource Policy
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      // DNS Prefetch Control
      dnsPrefetchControl: { allow: false },
      // Expect CT (deprecated, removed from newer versions)
      // expectCt: { enforce: true, maxAge: 30 },
      // Frameguard
      frameguard: { action: 'deny' },
      // Hide Powered-By
      hidePoweredBy: true,
      // HSTS
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      // IE No Open
      ieNoOpen: true,
      // NoSniff
      noSniff: true,
      // Origin Agent Cluster
      originAgentCluster: true,
      // Permissions Policy (deprecated, use Permissions-Policy header directly)
      // permissionsPolicy: {
      //   features: {
      //     camera: ["'none'"],
      //     microphone: ["'none'"],
      //     geolocation: ["'none'"],
      //   },
      // },
      // Referrer Policy
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      // XSS Protection
      xssFilter: true,
    });
  }

  use(req: Request, res: Response, next: NextFunction): void {
    // Apply Helmet security headers
    this.helmetMiddleware(req, res, () => {
      // Set CORS headers
      res.header('Access-Control-Allow-Origin', this.corsOrigin);
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS',
      );
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');

      // Additional security headers
      res.header('X-Content-Type-Options', 'nosniff');
      res.header('X-Frame-Options', 'DENY');
      res.header('X-XSS-Protection', '1; mode=block');

      // Remove server information
      res.removeHeader('X-Powered-By');

      next();
    });
  }
}
