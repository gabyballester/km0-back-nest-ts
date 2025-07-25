import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configService: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      log: ['error'],
    });
  }

  onModuleInit(): void {
    // La conexión se maneja automáticamente por PrismaClient
    console.log('🔗 PrismaService inicializado');
  }

  onModuleDestroy(): void {
    // La desconexión se maneja automáticamente por PrismaClient
    console.log('🔗 PrismaService destruido');
  }
}
