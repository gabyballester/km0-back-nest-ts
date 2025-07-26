import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDatabaseAdapter, DatabaseStatus } from './interfaces';
import { DatabaseFactory } from './factory/database.factory';

// Exportar la interfaz para uso en otros módulos
export interface DatabaseInfo {
  database_name: string;
  current_user: string;
  postgres_version: string;
}

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private adapter: IDatabaseAdapter | null = null;
  private status: DatabaseStatus = DatabaseStatus.DISCONNECTED;

  constructor(
    private readonly configService: ConfigService,
    private readonly databaseFactory: DatabaseFactory,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      // Create adapter based on configuration
      this.adapter = this.databaseFactory.createAdapter();

      // Connect to database
      await this.adapter.connect();

      this.status = DatabaseStatus.CONNECTED;

      // Verify database is working
      const isHealthy = await this.healthCheck();
      if (!isHealthy) {
        throw new Error('Base de datos no está funcionando correctamente');
      }
    } catch (error) {
      this.status = DatabaseStatus.ERROR;
      console.error('❌ Error al inicializar la base de datos:', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      if (this.adapter) {
        await this.adapter.disconnect();
      }
      this.status = DatabaseStatus.DISCONNECTED;
    } catch (error) {
      console.error('❌ Error al cerrar conexión:', error);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.adapter) {
        return false;
      }
      return await this.adapter.healthCheck();
    } catch (error) {
      console.error('❌ Health check falló:', error);
      return false;
    }
  }

  async getDatabaseInfo(): Promise<DatabaseInfo | null> {
    try {
      if (!this.adapter) {
        return null;
      }
      return await this.adapter.getDatabaseInfo();
    } catch (error) {
      console.error(
        '❌ Error al obtener información de la base de datos:',
        error,
      );
      return null;
    }
  }

  /**
   * Get current database adapter
   */
  getAdapter(): IDatabaseAdapter | null {
    return this.adapter;
  }

  /**
   * Get current database status
   */
  getStatus(): DatabaseStatus {
    return this.status;
  }

  /**
   * Get current ORM type
   */
  getOrmType(): string {
    return this.databaseFactory.getOrmType();
  }

  /**
   * Check if using Drizzle ORM
   */
  isDrizzle(): boolean {
    return this.databaseFactory.isDrizzle();
  }

  /**
   * Check if using Prisma ORM
   */
  isPrisma(): boolean {
    return this.databaseFactory.isPrisma();
  }
}
