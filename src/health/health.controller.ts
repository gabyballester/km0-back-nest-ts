import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../infrastructure/database/database.service';
import { ENV_KEYS, ENV_VALUES } from '../shared/constants/environment';
import * as os from 'os';

// Definir la interfaz localmente para evitar problemas de importación
interface DatabaseInfo {
  database_name: string;
  current_user: string;
  postgres_version: string;
}

@Controller('health')
export class HealthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {}

  private getDatabaseName(dbInfo: DatabaseInfo | null): string {
    if (!dbInfo) return 'unknown';
    return dbInfo.database_name || 'unknown';
  }

  private getDatabaseVersion(dbInfo: DatabaseInfo | null): string {
    if (!dbInfo) return 'unknown';
    return dbInfo.postgres_version || 'unknown';
  }

  private getEnvironment(): string {
    const env = this.configService.get<string>(ENV_KEYS.NODE_ENV);
    return env || ENV_VALUES.NODE_ENV.DEVELOPMENT;
  }

  private getMemoryInfo() {
    const memUsage = process.memoryUsage();
    return {
      used: Math.round(memUsage.heapUsed / 1024 / 1024),
      total: Math.round(memUsage.heapTotal / 1024 / 1024),
      free: Math.round((memUsage.heapTotal - memUsage.heapUsed) / 1024 / 1024),
    };
  }

  private getCpuInfo() {
    const cpuUsage = process.cpuUsage();
    return {
      load: [cpuUsage.user, cpuUsage.system],
      cores: os.cpus().length,
    };
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
      environment: this.getEnvironment(),
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

    return {
      status: dbStatus ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: this.getEnvironment(),
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
        memory: this.getMemoryInfo(),
        cpu: this.getCpuInfo(),
      },
      services: {
        database: dbStatus,
        config: true,
      },
    };
  }
}
