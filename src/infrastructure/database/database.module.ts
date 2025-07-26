import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { DatabaseFactory } from './factory/database.factory';
import { PrismaAdapter } from './adapters/prisma.adapter';
import { DrizzleAdapter } from './adapters/drizzle.adapter';

/**
 * Database module configuration
 * Provides database connectivity with ORM abstraction
 */
@Module({
  imports: [ConfigModule],
  providers: [
    DatabaseService,
    DatabaseFactory,
    // Register both adapters for dependency injection
    {
      provide: 'PRISMA_ADAPTER',
      useClass: PrismaAdapter,
    },
    {
      provide: 'DRIZZLE_ADAPTER',
      useClass: DrizzleAdapter,
    },
  ],
  exports: [
    DatabaseService,
    DatabaseFactory,
    'PRISMA_ADAPTER',
    'DRIZZLE_ADAPTER',
  ],
})
export class DatabaseModule {}
