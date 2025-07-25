import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DatabaseService } from '../infrastructure/database/database.service';

/**
 * Health check controller for monitoring and load balancers
 * Provides basic health status and system information
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {}

  /**
   * Basic health check endpoint
   * Returns 200 OK if the service is running
   */
  @Get()
  @ApiOperation({
    summary: 'Health check endpoint',
    description: 'Returns basic health status and environment.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 123.456 },
        environment: { type: 'string', example: 'development' },
      },
      example: {
        status: 'ok',
        timestamp: '2024-01-01T00:00:00.000Z',
        uptime: 123.456,
        environment: 'development',
      },
    },
  })
  getHealth(): {
    status: string;
    timestamp: string;
    uptime: number;
    environment: string;
    database: string;
  } {
    // Eliminar el await innecesario
    const dbStatus = this.databaseService.healthCheck();

    return {
      status: dbStatus ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.configService.get<string>('NODE_ENV') || 'development',
      database: dbStatus ? 'connected' : 'disconnected',
    };
  }

  /**
   * Detailed health check with more system information
   */
  @Get('detailed')
  @ApiOperation({
    summary: 'Detailed health check',
    description: 'Returns detailed health status, memory usage, and version.',
  })
  @ApiResponse({
    status: 200,
    description: 'Detailed health information',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 123.456 },
        environment: { type: 'string', example: 'development' },
        memory: {
          type: 'object',
          properties: {
            used: { type: 'number', example: 50 },
            total: { type: 'number', example: 100 },
            percentage: { type: 'number', example: 50 },
          },
        },
        version: { type: 'string', example: '1.0.0' },
      },
      example: {
        status: 'ok',
        timestamp: '2024-01-01T00:00:00.000Z',
        uptime: 123.456,
        environment: 'development',
        memory: { used: 50, total: 100, percentage: 50 },
        version: '1.0.0',
      },
    },
  })
  getDetailedHealth(): {
    status: string;
    timestamp: string;
    uptime: number;
    environment: string;
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    version: string;
  } {
    const memUsage = process.memoryUsage();
    const totalMem = memUsage.heapTotal;
    const usedMem = memUsage.heapUsed;
    const memPercentage = (usedMem / totalMem) * 100;

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.configService.get<string>('NODE_ENV') || 'development',
      memory: {
        used: Math.round(usedMem / 1024 / 1024), // MB
        total: Math.round(totalMem / 1024 / 1024), // MB
        percentage: Math.round(memPercentage),
      },
      version: this.configService.get<string>('npm_package_version') || '0.0.1',
    };
  }
}
