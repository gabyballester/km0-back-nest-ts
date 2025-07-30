import { Module } from '@nestjs/common';
import { UserController } from '@/modules/users/presentation/user.controller';
import { ProfileController } from '@/modules/users/presentation/profile.controller';
import { UserService } from '@/modules/users/application/services/user.service';
import { ProfileService } from '@/modules/users/application/services/profile.service';
import { UserRepository } from '@/modules/users/infrastructure/repositories/user.repository';
import { ProfileRepository } from '@/modules/users/infrastructure/repositories/profile.repository';
import { UserDomainService } from '@/modules/users/infrastructure/services/user-domain.service';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { PROFILE_REPOSITORY } from '@/modules/users/domain/repositories/profile.repository.interface';

/**
 * Módulo de usuarios
 *
 * Configura todas las dependencias necesarias para el módulo de usuarios
 * siguiendo la arquitectura hexagonal con Prisma ORM.
 */
@Module({
  controllers: [UserController, ProfileController],
  providers: [
    PrismaService,
    UserRepository,
    ProfileRepository,
    UserDomainService,
    UserService,
    ProfileService,
    {
      provide: PROFILE_REPOSITORY,
      useClass: ProfileRepository,
    },
  ],
  exports: [UserService, ProfileService],
})
export class UserModule {}
