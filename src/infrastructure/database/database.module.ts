import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from '@/infrastructure/database/database.service';
import { DatabaseFactory } from '@/infrastructure/database/factory/database.factory';
import { PrismaAdapter } from '@/infrastructure/database/adapters/prisma.adapter';
import { DrizzleAdapter } from '@/infrastructure/database/adapters/drizzle.adapter';

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
