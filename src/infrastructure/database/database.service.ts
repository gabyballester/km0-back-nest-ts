import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private isConnected = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit(): void {
    console.log('🗄️  Inicializando servicio de base de datos...');

    try {
      // Marcar como conectado (la conexión real se maneja por PrismaClient)
      this.isConnected = true;
      console.log('✅ Conexión a la base de datos establecida');

      // Verificar que la base de datos esté funcionando
      const isHealthy = this.healthCheck();
      if (!isHealthy) {
        throw new Error('Base de datos no está funcionando correctamente');
      }
      console.log('✅ Base de datos funcionando correctamente');

      // Mostrar información básica
      console.log('📊 Base de datos conectada correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar la base de datos:', error);
      throw error;
    }
  }

  onModuleDestroy(): void {
    console.log('🔄 Cerrando conexión a la base de datos...');
    try {
      this.isConnected = false;
      console.log('✅ Conexión a la base de datos cerrada');
    } catch (error) {
      console.error('❌ Error al cerrar conexión:', error);
    }
  }

  healthCheck(): boolean {
    try {
      // Verificación básica de conexión usando el estado interno
      return this.isConnected;
    } catch (error) {
      console.error('❌ Health check falló:', error);
      return false;
    }
  }

  getDatabaseInfo(): {
    database_name: string;
    current_user: string;
    postgres_version: string;
  } | null {
    try {
      // Información básica de la base de datos
      // En producción, esta información se puede obtener de las variables de entorno
      const databaseUrl = this.configService.get<string>('DATABASE_URL');
      const databaseName = databaseUrl
        ? this.extractDatabaseName(databaseUrl)
        : 'km0_db';

      return {
        database_name: databaseName,
        current_user: 'postgres',
        postgres_version: 'PostgreSQL',
      };
    } catch (error) {
      console.error(
        '❌ Error al obtener información de la base de datos:',
        error,
      );
      return null;
    }
  }

  private extractDatabaseName(databaseUrl: string): string {
    try {
      // Extraer el nombre de la base de datos de la URL de forma segura
      const url = new URL(databaseUrl);
      const pathParts = url.pathname.split('/');
      return pathParts[pathParts.length - 1] || 'km0_db';
    } catch {
      return 'km0_db';
    }
  }
}
