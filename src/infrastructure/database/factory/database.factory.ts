import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDatabaseAdapter } from '../interfaces';
import { PrismaAdapter } from '../adapters/prisma.adapter';
import { DrizzleAdapter } from '../adapters/drizzle.adapter';

/**
 * Supported ORM types
 */
export type OrmType = 'prisma' | 'drizzle';

/**
 * Database factory for ORM selection
 * Allows dynamic switching between Prisma and Drizzle
 */
@Injectable()
export class DatabaseFactory {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Create database adapter based on configuration
   */
  createAdapter(): IDatabaseAdapter {
    const ormType = this.getOrmType();

    switch (ormType) {
      case 'drizzle':
        return new DrizzleAdapter(this.configService);
      case 'prisma':
      default:
        return new PrismaAdapter(this.configService);
    }
  }

  /**
   * Create specific adapter by type
   */
  createAdapterByType(ormType: OrmType): IDatabaseAdapter {
    switch (ormType) {
      case 'drizzle':
        return new DrizzleAdapter(this.configService);
      case 'prisma':
        return new PrismaAdapter(this.configService);
      default:
        throw new Error(`Unsupported ORM type: ${ormType}`);
    }
  }

  /**
   * Get current ORM type from configuration
   */
  getOrmType(): OrmType {
    const ormType = this.configService.get<string>('DATABASE_ORM', 'prisma');

    if (ormType === 'drizzle' || ormType === 'prisma') {
      return ormType;
    }

    console.warn(
      `⚠️ Invalid DATABASE_ORM value: ${ormType}. Defaulting to prisma`,
    );
    return 'prisma';
  }

  /**
   * Check if current ORM is Drizzle
   */
  isDrizzle(): boolean {
    return this.getOrmType() === 'drizzle';
  }

  /**
   * Check if current ORM is Prisma
   */
  isPrisma(): boolean {
    return this.getOrmType() === 'prisma';
  }
}
