import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configService: ConfigService) {
    // Motivo: Prisma genera el cliente dinámicamente y este warning es un falso positivo aceptado por la comunidad.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      log: ['error'],
    });
  }

  onModuleInit(): void {
    console.log('🔗 PrismaService inicializado');
  }

  onModuleDestroy(): void {
    console.log('🔗 PrismaService destruido');
  }
}
