import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { API_ENDPOINTS } from '../../shared/constants/api';

/**
 * Controlador de ejemplo para demostrar el versionado de la API
 *
 * Endpoints disponibles:
 * - GET /api/v1/example - Endpoint versionado
 * - GET /health - Health check (sin versionar)
 * - GET /docs - Documentación (sin versionar)
 */
@ApiTags('example')
@Controller('example')
export class ExampleController {
  /**
   * Endpoint de ejemplo versionado
   *
   * URL completa: GET /api/v1/example
   *
   * Este endpoint está versionado y seguirá las reglas de la v1 de la API.
   * Para futuras versiones, se puede crear un nuevo controlador con v2.
   */
  @Get()
  @ApiOperation({
    summary: 'Endpoint de ejemplo',
    description: 'Endpoint de ejemplo que demuestra el versionado de la API',
  })
  @ApiResponse({
    status: 200,
    description: 'Respuesta exitosa',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Hello from API v1!' },
        version: { type: 'string', example: 'v1' },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        endpoint: { type: 'string', example: '/api/v1/example' },
      },
    },
  })
  getExample(): {
    message: string;
    version: string;
    timestamp: string;
    endpoint: string;
  } {
    return {
      message: 'Hello from API v1!',
      version: 'v1',
      timestamp: new Date().toISOString(),
      endpoint: `${API_ENDPOINTS.V1_BASE}/example`,
    };
  }

  /**
   * Endpoint de ejemplo con información sobre el versionado
   *
   * URL completa: GET /api/v1/example/info
   */
  @Get('info')
  @ApiOperation({
    summary: 'Información del versionado',
    description:
      'Proporciona información sobre la estructura de versionado de la API',
  })
  @ApiResponse({
    status: 200,
    description: 'Información del versionado',
    schema: {
      type: 'object',
      properties: {
        currentVersion: { type: 'string', example: 'v1' },
        availableVersions: {
          type: 'array',
          items: { type: 'string' },
          example: ['v1'],
        },
        versionedEndpoints: {
          type: 'array',
          items: { type: 'string' },
          example: ['/api/v1/example', '/api/v1/example/info'],
        },
        nonVersionedEndpoints: {
          type: 'array',
          items: { type: 'string' },
          example: ['/health', '/health/detailed', '/docs'],
        },
        documentation: { type: 'string', example: '/docs' },
      },
    },
  })
  getVersioningInfo(): {
    currentVersion: string;
    availableVersions: string[];
    versionedEndpoints: string[];
    nonVersionedEndpoints: string[];
    documentation: string;
  } {
    return {
      currentVersion: 'v1',
      availableVersions: ['v1'],
      versionedEndpoints: [
        `${API_ENDPOINTS.V1_BASE}/example`,
        `${API_ENDPOINTS.V1_BASE}/example/info`,
      ],
      nonVersionedEndpoints: [
        API_ENDPOINTS.HEALTH,
        API_ENDPOINTS.HEALTH_DETAILED,
        API_ENDPOINTS.DOCS,
      ],
      documentation: API_ENDPOINTS.DOCS,
    };
  }
}
