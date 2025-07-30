/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { IProfileRepository } from '@/modules/users/domain/repositories/profile.repository.interface';
import { Profile } from '@/modules/users/domain/entities/profile.entity';
import { Profile as PrismaProfile } from '@prisma/client';

/**
 * Implementación del repositorio de perfiles usando Prisma ORM
 */
@Injectable()
export class ProfileRepository implements IProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Convierte datos de Prisma a formato compatible con ProfileEntity.fromJSON
   */
  private convertPrismaData(profile: PrismaProfile) {
    return {
      ...profile,
      lastName2: profile.lastName2 ?? undefined,
      phone: profile.phone ?? undefined,
      city: profile.city ?? undefined,
      postalCode: profile.postalCode ?? undefined,
    };
  }

  /**
   * Crea un nuevo perfil
   */
  async create(profile: Profile): Promise<Profile> {
    const createdProfile = await this.prisma.profile.create({
      data: {
        id: profile.id,
        userId: profile.userId,
        firstName: profile.firstName,
        lastName1: profile.lastName1,
        lastName2: profile.lastName2,
        phone: profile.phone,
        language: profile.language,
        city: profile.city,
        postalCode: profile.postalCode,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });

    return Profile.fromJSON(this.convertPrismaData(createdProfile));
  }

  /**
   * Busca un perfil por su ID
   */
  async findById(id: string): Promise<Profile | null> {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
    });

    return profile ? Profile.fromJSON(this.convertPrismaData(profile)) : null;
  }

  /**
   * Busca un perfil por su userId
   */
  async findByUserId(userId: string): Promise<Profile | null> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    return profile ? Profile.fromJSON(this.convertPrismaData(profile)) : null;
  }

  /**
   * Busca todos los perfiles con paginación
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    profiles: Profile[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [profiles, total] = await Promise.all([
      this.prisma.profile.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.profile.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      profiles: profiles.map(profile =>
        Profile.fromJSON(this.convertPrismaData(profile)),
      ),
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Actualiza un perfil
   */
  async update(id: string, profileData: Partial<Profile>): Promise<Profile> {
    const existingProfile = await this.findById(id);
    if (!existingProfile) {
      throw new Error(`Profile with id ${id} not found`);
    }

    const updatedProfile = await this.prisma.profile.update({
      where: { id },
      data: {
        firstName: profileData.firstName,
        lastName1: profileData.lastName1,
        lastName2: profileData.lastName2,
        phone: profileData.phone,
        language: profileData.language,
        city: profileData.city,
        postalCode: profileData.postalCode,
        updatedAt: new Date(),
      },
    });

    return Profile.fromJSON(this.convertPrismaData(updatedProfile));
  }

  /**
   * Elimina un perfil
   */
  async delete(id: string): Promise<void> {
    const existingProfile = await this.findById(id);
    if (!existingProfile) {
      throw new Error(`Profile with id ${id} not found`);
    }

    await this.prisma.profile.delete({
      where: { id },
    });
  }

  /**
   * Verifica si existe un perfil por userId
   */
  async existsByUserId(userId: string): Promise<boolean> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    return !!profile;
  }

  /**
   * Cuenta el total de perfiles
   */
  async count(): Promise<number> {
    return await this.prisma.profile.count();
  }

  /**
   * Busca perfiles por ciudad
   */
  async findByCity(city: string): Promise<Profile[]> {
    const profiles = await this.prisma.profile.findMany({
      where: {
        city: {
          contains: city,
          mode: 'insensitive',
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return profiles.map(profile =>
      Profile.fromJSON(this.convertPrismaData(profile)),
    );
  }

  /**
   * Busca perfiles por idioma
   */
  async findByLanguage(language: string): Promise<Profile[]> {
    const profiles = await this.prisma.profile.findMany({
      where: {
        language: {
          equals: language,
          mode: 'insensitive',
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return profiles.map(profile =>
      Profile.fromJSON(this.convertPrismaData(profile)),
    );
  }

  /**
   * Busca perfiles completos (con todos los campos obligatorios)
   */
  async findCompleteProfiles(): Promise<Profile[]> {
    const profiles = await this.prisma.profile.findMany({
      where: {
        AND: [
          { firstName: { not: undefined } },
          { lastName1: { not: undefined } },
          { phone: { not: undefined } },
          { city: { not: undefined } },
          { postalCode: { not: undefined } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return profiles.map(profile =>
      Profile.fromJSON(this.convertPrismaData(profile)),
    );
  }
}
