import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../infrastructure/database/database.service';
import { ENV_KEYS, ENV_VALUES } from '../shared/constants/environment';
import * as os from 'os';

interface DatabaseInfo {
  database_name: string;
  current_user: string;
  postgres_version: string;
}

/**
 * Health check controller
 * Provides health status endpoints for monitoring
 */
@Controller('health')
export class HealthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {}

  private getDatabaseName(dbInfo: DatabaseInfo | null): string {
    return dbInfo && dbInfo.database_name ? dbInfo.database_name : 'unknown';
  }

  private getDatabaseVersion(dbInfo: DatabaseInfo | null): string {
    return dbInfo && dbInfo.postgres_version
      ? dbInfo.postgres_version
      : 'unknown';
  }

  /**
   * Basic health check endpoint
   * Returns simple health status
   */
  @Get()
  getHealth(): {
    status: string;
    timestamp: string;
    environment: string;
    uptime: number;
  } {
    const dbStatus = this.databaseService.healthCheck();

    return {
      status: dbStatus ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      environment:
        this.configService.get<string>(ENV_KEYS.NODE_ENV) ||
        ENV_VALUES.NODE_ENV.DEVELOPMENT,
      uptime: process.uptime(),
    };
  }

  /**
   * Detailed health check endpoint
   * Returns comprehensive health information
   */
  @Get('detailed')
  getDetailedHealth(): {
    status: string;
    timestamp: string;
    environment: string;
    uptime: number;
    database: {
      status: string;
      info: {
        name: string;
        type: string;
        version?: string;
      };
    };
    system: {
      nodeVersion: string;
      platform: string;
      memory: {
        used: number;
        total: number;
        free: number;
      };
      cpu: {
        load: number[];
        cores: number;
      };
    };
    services: {
      database: boolean;
      config: boolean;
    };
  } {
    const dbStatus = this.databaseService.healthCheck();
    const dbInfo = this.databaseService.getDatabaseInfo();

    // Get system information
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      status: dbStatus ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      environment:
        this.configService.get<string>(ENV_KEYS.NODE_ENV) ||
        ENV_VALUES.NODE_ENV.DEVELOPMENT,
      uptime: process.uptime(),
      database: {
        status: dbStatus ? 'connected' : 'disconnected',
        info: {
          name: this.getDatabaseName(dbInfo),
          type: 'PostgreSQL',
          version: this.getDatabaseVersion(dbInfo),
        },
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memory: {
          used: Math.round(memUsage.heapUsed / 1024 / 1024),
          total: Math.round(memUsage.heapTotal / 1024 / 1024),
          free: Math.round(
            (memUsage.heapTotal - memUsage.heapUsed) / 1024 / 1024,
          ),
        },
        cpu: {
          load: [cpuUsage.user, cpuUsage.system],
          cores: os.cpus().length,
        },
      },
      services: {
        database: dbStatus,
        config: true,
      },
    };
  }
}
