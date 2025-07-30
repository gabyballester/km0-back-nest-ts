import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configService: ConfigService) {
    super({
      log: ['error', 'warn'],
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      console.log('🔗 PrismaService conectado exitosamente');

      // Verificar conexión
      await this.$queryRaw`SELECT 1`;
      console.log('✅ Base de datos accesible');
    } catch (error) {
      console.error('❌ Error al conectar PrismaService:', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.$disconnect();
      console.log('🔗 PrismaService desconectado exitosamente');
    } catch (error) {
      console.error('❌ Error al desconectar PrismaService:', error);
    }
  }

  /**
   * Health check para verificar la conexión a la base de datos
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('❌ Health check falló:', error);
      return false;
    }
  }

  /**
   * Obtener información de la base de datos
   */
  async getDatabaseInfo(): Promise<{
    database_name: string;
    current_user: string;
    postgres_version: string;
  } | null> {
    try {
      const result = await this.$queryRaw<
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
