import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import {
  IDatabaseAdapter,
  DatabaseStatus,
  DatabaseAdapterConfig,
} from '../interfaces';

/**
 * Prisma ORM adapter implementation
 * Provides database connectivity using Prisma ORM
 */
@Injectable()
export class PrismaAdapter
  implements IDatabaseAdapter, OnModuleInit, OnModuleDestroy
{
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
    };
  }

  async onModuleInit(): Promise<void> {
    console.log('🔗 Inicializando PrismaAdapter...');
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    console.log('🔗 Cerrando PrismaAdapter...');
    await this.disconnect();
  }

  async connect(): Promise<void> {
    try {
      this.status = DatabaseStatus.CONNECTING;
      console.log('🔗 Conectando a la base de datos con Prisma...');

      // Create Prisma client
      this.prisma = new PrismaClient({
        log: ['error'],
        datasources: {
          db: {
            url: this.config.connectionString,
          },
        },
      });

      // Test connection
      await this.healthCheck();

      this.status = DatabaseStatus.CONNECTED;
      console.log('✅ Conexión a la base de datos establecida con Prisma');
    } catch (error) {
      this.status = DatabaseStatus.ERROR;
      console.error('❌ Error al conectar con Prisma:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      console.log('🔄 Cerrando conexión Prisma...');

      if (this.prisma) {
        await this.prisma.$disconnect();
        this.prisma = null;
      }

      this.status = DatabaseStatus.DISCONNECTED;
      console.log('✅ Conexión Prisma cerrada');
    } catch (error) {
      console.error('❌ Error al cerrar conexión Prisma:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.prisma) {
        this.status = DatabaseStatus.ERROR;
        return false;
      }

      // Execute simple query to check connection
      await this.executeRawQuery('SELECT 1');
      this.status = DatabaseStatus.CONNECTED;
      return true;
    } catch (error) {
      console.error('❌ Health check Prisma falló:', error);
      this.status = DatabaseStatus.ERROR;
      return false;
    }
  }

  async getDatabaseInfo(): Promise<{
    database_name: string;
    current_user: string;
    postgres_version: string;
  } | null> {
    try {
      if (!this.prisma) {
        return null;
      }

      const result = (await this.executeRawQuery(
        'SELECT current_database() as database_name, current_user, version() as postgres_version',
      )) as Array<{
        database_name: string;
        current_user: string;
        postgres_version: string;
      }>;

      if (result && result.length > 0) {
        const info = result[0];
        return {
          database_name: info.database_name ?? 'unknown',
          current_user: info.current_user ?? 'unknown',
          postgres_version: info.postgres_version ?? 'unknown',
        };
      }

      return null;
    } catch (error) {
      console.error(
        '❌ Error al obtener información de la base de datos Prisma:',
        error,
      );
      return null;
    }
  }

  async executeRawQuery(query: string): Promise<unknown> {
    if (!this.prisma) {
      throw new Error('Prisma client not initialized');
    }

    return await this.prisma.$queryRawUnsafe(query);
  }

  getOrmInstance(): PrismaClient | null {
    return this.prisma;
  }

  getStatus(): DatabaseStatus {
    return this.status;
  }
}
