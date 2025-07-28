import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { DatabaseService } from '@/infrastructure/database/database.service';
import { ENV_KEYS, ENV_VALUES } from '@/shared/constants/environment';
import * as os from 'os';

// Definir la interfaz localmente para evitar problemas de importación
interface DatabaseInfo {
  database_name: string;
  current_user: string;
  postgres_version: string;
}

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {}

  private getDatabaseName(dbInfo: DatabaseInfo | null): string {
    if (!dbInfo) return 'unknown';
    return dbInfo.database_name ?? 'unknown';
  }

  private getDatabaseVersion(dbInfo: DatabaseInfo | null): string {
    if (!dbInfo) return 'unknown';
    return dbInfo.postgres_version ?? 'unknown';
  }

  private getEnvironment(): string {
    const env = this.configService.get<string>(ENV_KEYS.NODE_ENV);
    if (env === undefined || env === null) {
      return ENV_VALUES.NODE_ENV.DEVELOPMENT;
    }
    return env;
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
      load: [cpuUsage.user, cpuUsage.system], // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      cores: os.cpus().length, // eslint-disable-line @typescript-eslint/no-unsafe-member-access
    };
  }

  /**
   * Basic health check endpoint
   * Returns simple health status
   */
  @Get()
  @ApiOperation({
    summary: 'Health Check Básico',
    description:
      'Verifica el estado básico de la aplicación y la conexión a la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Aplicación saludable',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'healthy' },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        environment: { type: 'string', example: 'production' },
        uptime: { type: 'number', example: 123.456 },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Aplicación no saludable',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'unhealthy' },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        environment: { type: 'string', example: 'production' },
        uptime: { type: 'number', example: 123.456 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno del servidor',
  })
  async getHealth(): Promise<{
    status: string;
    timestamp: string;
    environment: string;
    uptime: number;
  }> {
    const dbStatus = await this.databaseService.healthCheck();

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
  @ApiOperation({
    summary: 'Health Check Detallado',
    description:
      'Proporciona información detallada sobre el estado de la aplicación, base de datos, sistema y servicios',
  })
  @ApiResponse({
    status: 200,
    description: 'Información detallada de salud',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'healthy' },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        environment: { type: 'string', example: 'production' },
        uptime: { type: 'number', example: 123.456 },
        database: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'connected' },
            info: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'km0_db' },
                type: { type: 'string', example: 'PostgreSQL' },
                version: { type: 'string', example: 'PostgreSQL 14.0' },
              },
            },
          },
        },
        system: {
          type: 'object',
          properties: {
            nodeVersion: { type: 'string', example: 'v18.17.0' },
            platform: { type: 'string', example: 'linux' },
            memory: {
              type: 'object',
              properties: {
                used: { type: 'number', example: 45 },
                total: { type: 'number', example: 512 },
                free: { type: 'number', example: 467 },
              },
            },
            cpu: {
              type: 'object',
              properties: {
                load: {
                  type: 'array',
                  items: { type: 'number' },
                  example: [123456, 78901],
                },
                cores: { type: 'number', example: 4 },
              },
            },
          },
        },
        services: {
          type: 'object',
          properties: {
            database: { type: 'boolean', example: true },
            config: { type: 'boolean', example: true },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Aplicación no saludable',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno del servidor',
  })
  async getDetailedHealth(): Promise<{
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
  }> {
    const dbStatus = await this.databaseService.healthCheck();
    const dbInfo = await this.databaseService.getDatabaseInfo();

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
