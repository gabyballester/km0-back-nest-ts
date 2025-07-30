import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';

// Exportar la interfaz para uso en otros módulos
export interface DatabaseInfo {
  database_name: string;
  current_user: string;
  postgres_version: string;
}

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private isConnected = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    console.log('🗄️  Inicializando servicio de base de datos...');

    try {
      // Verificar conexión usando Prisma
      const isHealthy = await this.healthCheck();
      if (!isHealthy) {
        throw new Error('Base de datos no está funcionando correctamente');
      }

      this.isConnected = true;
      console.log('✅ Base de datos conectada correctamente');
      console.log('📊 Base de datos funcionando correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar la base de datos:', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    console.log('🔄 Cerrando conexión a la base de datos...');
    try {
      await this.prisma.$disconnect();
      this.isConnected = false;
      console.log('✅ Conexión a la base de datos cerrada');
    } catch (error) {
      console.error('❌ Error al cerrar conexión:', error);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Verificación real de conexión usando Prisma
      await this.prisma.$queryRaw`SELECT 1`;
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('❌ Health check falló:', error);
      this.isConnected = false;
      return false;
    }
  }

  async getDatabaseInfo(): Promise<DatabaseInfo | null> {
    try {
      // Obtener información real de PostgreSQL usando Prisma
      const result = await this.prisma.$queryRaw<
        Array<{
          current_database: string;
          current_user: string;
          version: string;
        }>
      >`SELECT current_database(), current_user, version()`;

      if (result && result.length > 0) {
        const info = result[0];
        return {
          database_name: info.current_database ?? 'unknown',
          current_user: info.current_user ?? 'unknown',
          postgres_version: info.version ?? 'unknown',
        };
      }

      return null;
    } catch (error) {
      console.error(
        '❌ Error al obtener información real de la base de datos:',
        error,
      );
      return null;
    }
  }

  /**
   * Get Prisma service instance
   */
  getPrismaService(): PrismaService {
    return this.prisma;
  }

  /**
   * Check if database is connected
   */
  isDatabaseConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Extract database name from URL (fallback method)
   */
  private extractDatabaseName(databaseUrl: string): string {
    try {
      const url = new URL(databaseUrl);
      const pathParts = url.pathname.split('/');
      const lastPart = pathParts[pathParts.length - 1];
      return lastPart || 'km0_db';
    } catch {
      return 'km0_db';
    }
  }
}
