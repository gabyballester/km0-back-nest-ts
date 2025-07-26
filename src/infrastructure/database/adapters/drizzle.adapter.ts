import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
  IDatabaseAdapter,
  DatabaseStatus,
  DatabaseAdapterConfig,
} from '../interfaces';

/**
 * Drizzle ORM adapter implementation
 * Provides database connectivity using Drizzle ORM
 */
@Injectable()
export class DrizzleAdapter
  implements IDatabaseAdapter, OnModuleInit, OnModuleDestroy
{
  private client: postgres.Sql | null = null;
  private db: ReturnType<typeof drizzle> | null = null;
  private status: DatabaseStatus = DatabaseStatus.DISCONNECTED;
  private config: DatabaseAdapterConfig;

  constructor(private readonly configService: ConfigService) {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined for Drizzle connection.');
    }

    this.config = {
      connectionString: databaseUrl,
      maxConnections: 10,
      idleTimeout: 30,
      connectionTimeout: 10,
    };
  }

  async onModuleInit(): Promise<void> {
    console.log('🔗 Inicializando DrizzleAdapter...');
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    console.log('🔗 Cerrando DrizzleAdapter...');
    await this.disconnect();
  }

  async connect(): Promise<void> {
    try {
      this.status = DatabaseStatus.CONNECTING;
      console.log('🔗 Conectando a la base de datos con Drizzle...');

      // Create postgres client
      this.client = postgres(this.config.connectionString, {
        max: this.config.maxConnections,
        idle_timeout: this.config.idleTimeout,
        connect_timeout: this.config.connectionTimeout,
        onnotice: () => {}, // Suppress notices
      });

      // Create drizzle instance
      this.db = drizzle(this.client);

      // Test connection
      await this.healthCheck();

      this.status = DatabaseStatus.CONNECTED;
      console.log('✅ Conexión a la base de datos establecida con Drizzle');
    } catch (error) {
      this.status = DatabaseStatus.ERROR;
      console.error('❌ Error al conectar con Drizzle:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      console.log('🔄 Cerrando conexión Drizzle...');

      if (this.client) {
        await this.client.end();
        this.client = null;
      }

      this.db = null;
      this.status = DatabaseStatus.DISCONNECTED;
      console.log('✅ Conexión Drizzle cerrada');
    } catch (error) {
      console.error('❌ Error al cerrar conexión Drizzle:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.db) {
        this.status = DatabaseStatus.ERROR;
        return false;
      }

      // Execute simple query to check connection
      await this.executeRawQuery('SELECT 1');
      this.status = DatabaseStatus.CONNECTED;
      return true;
    } catch (error) {
      console.error('❌ Health check Drizzle falló:', error);
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
      if (!this.db) {
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
        '❌ Error al obtener información de la base de datos Drizzle:',
        error,
      );
      return null;
    }
  }

  async executeRawQuery(query: string): Promise<unknown> {
    if (!this.client) {
      throw new Error('Drizzle client not initialized');
    }

    return await this.client.unsafe(query);
  }

  getOrmInstance(): ReturnType<typeof drizzle> | null {
    return this.db;
  }

  getStatus(): DatabaseStatus {
    return this.status;
  }
}
