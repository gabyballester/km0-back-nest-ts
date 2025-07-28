import { Module } from '@nestjs/common';
import { UserController } from '@/modules/users/presentation/user.controller';
import { UserService } from '@/modules/users/application/services/user.service';
import { UserRepository } from '@/modules/users/infrastructure/repositories/user.repository';
import { UserDomainService } from '@/modules/users/infrastructure/services/user-domain.service';
import { DatabaseModule } from '@/infrastructure/database/database.module';

/**
 * Módulo de usuarios
 *
 * Configura todas las dependencias necesarias para el módulo de usuarios
 * siguiendo la arquitectura hexagonal.
 */
@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserRepository, UserDomainService, UserService],
  exports: [UserService],
})
export class UserModule {}
