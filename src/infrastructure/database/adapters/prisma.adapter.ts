import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import {
  IDatabaseAdapter,
  DatabaseStatus,
  DatabaseAdapterConfig,
} from '@/infrastructure/database/interfaces';

/**
 * Prisma ORM adapter implementation
 * Provides database connectivity using Prisma ORM
 */
@Injectable()
export class PrismaAdapter implements IDatabaseAdapter {
  private prisma: PrismaClient | null = null;
  private status: DatabaseStatus = DatabaseStatus.DISCONNECTED;
  private config: DatabaseAdapterConfig;

  constructor(private readonly configService: ConfigService) {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined for Prisma connection.');
    }

    this.config = {
      connectionString: databaseUrl,
      maxConnections: 10,
      idleTimeout: 30,
      connectionTimeout: 10,
    };
  }

  async connect(): Promise<void> {
    try {
      this.status = DatabaseStatus.CONNECTING;

      // Create Prisma client
      this.prisma = new PrismaClient({
        log: ['error', 'warn'],
        datasources: {
          db: {
            url: this.config.connectionString,
          },
        },
      });

      // Test connection
      await this.healthCheck();

      this.status = DatabaseStatus.CONNECTED;
      console.log('✅ Prisma adapter conectado exitosamente');
    } catch (error) {
      this.status = DatabaseStatus.ERROR;
      console.error('❌ Error al conectar con Prisma:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.prisma) {
        await this.prisma.$disconnect();
        this.prisma = null;
      }
      this.status = DatabaseStatus.DISCONNECTED;
      console.log('✅ Prisma adapter desconectado exitosamente');
    } catch (error) {
      console.error('❌ Error al desconectar Prisma:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.prisma) {
        return false;
      }

      await this.prisma.$queryRaw`SELECT 1`;
      this.status = DatabaseStatus.CONNECTED;
      return true;
    } catch (error) {
      this.status = DatabaseStatus.ERROR;
      console.error('❌ Health check falló:', error);
      return false;
    }
  }

  getStatus(): DatabaseStatus {
    return this.status;
  }

  getConfig(): DatabaseAdapterConfig {
    return this.config;
  }

  getOrmInstance(): PrismaClient | null {
    return this.prisma;
  }

  /**
   * Get database information
   */
  async getDatabaseInfo(): Promise<{
    database_name: string;
    current_user: string;
    postgres_version: string;
  } | null> {
    try {
      if (!this.prisma) {
        return null;
      }

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
      console.error('❌ Error al obtener información de la BD:', error);
      return null;
    }
  }
}
