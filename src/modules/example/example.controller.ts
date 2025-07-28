import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { API_ENDPOINTS } from '@/shared/constants/api';

/**
 * Controlador de ejemplo
 *
 * Endpoints disponibles:
 * - GET /example - Endpoint de ejemplo
 * - GET /example/info - Información de la API
 * - GET /health - Health check
 * - GET /docs - Documentación
 */
@ApiTags('example')
@Controller('example')
export class ExampleController {
  /**
   * Endpoint de ejemplo
   *
   * URL completa: GET /example
   */
  @Get()
  @ApiOperation({
    summary: 'Endpoint de ejemplo',
    description: 'Endpoint de ejemplo simple',
  })
  @ApiResponse({
    status: 200,
    description: 'Respuesta exitosa',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Hello from API!' },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        endpoint: { type: 'string', example: '/example' },
      },
    },
  })
  getExample(): {
    message: string;
    timestamp: string;
    endpoint: string;
  } {
    return {
      message: 'Hello from API!',
      timestamp: new Date().toISOString(),
      endpoint: '/example',
    };
  }

  /**
   * Endpoint de ejemplo con información
   *
   * URL completa: GET /example/info
   */
  @Get('info')
  @ApiOperation({
    summary: 'Información de la API',
    description: 'Proporciona información sobre la estructura de la API',
  })
  @ApiResponse({
    status: 200,
    description: 'Información de la API',
    schema: {
      type: 'object',
      properties: {
        endpoints: {
          type: 'array',
          items: { type: 'string' },
          example: ['/example', '/example/info'],
        },
        systemEndpoints: {
          type: 'array',
          items: { type: 'string' },
          example: ['/health', '/health/detailed', '/docs'],
        },
        documentation: { type: 'string', example: '/docs' },
      },
    },
  })
  getApiInfo(): {
    endpoints: string[];
    systemEndpoints: string[];
    documentation: string;
  } {
    return {
      endpoints: ['/example', '/example/info'],
      systemEndpoints: [
        API_ENDPOINTS.HEALTH,
        API_ENDPOINTS.HEALTH_DETAILED,
        API_ENDPOINTS.DOCS,
      ],
      documentation: API_ENDPOINTS.DOCS,
    };
  }
}
