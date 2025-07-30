import { Expose, Transform } from 'class-transformer';

/**
 * DTO for profile responses
 */
export class ProfileResponseDto {
  @Expose()
  id!: string;

  @Expose()
  userId!: string;

  @Expose()
  firstName!: string;

  @Expose()
  lastName1!: string;

  @Expose()
  lastName2?: string;

  @Expose()
  phone?: string;

  @Expose()
  language!: string;

  @Expose()
  city?: string;

  @Expose()
  postalCode?: string;

  @Expose()
  @Transform(({ value }: { value: unknown }) =>
    value ? new Date(value as string) : undefined,
  )
  createdAt!: Date;

  @Expose()
  @Transform(({ value }: { value: unknown }) =>
    value ? new Date(value as string) : undefined,
  )
  updatedAt!: Date;

  // Computed properties
  @Expose()
  @Transform(({ obj }: { obj: Record<string, unknown> }) => {
    const lastName2 = obj.lastName2 ? ` ${obj.lastName2 as string}` : '';
    return `${obj.firstName as string} ${obj.lastName1 as string}${lastName2}`.trim();
  })
  fullName!: string;

  @Expose()
  @Transform(({ obj }: { obj: Record<string, unknown> }) => {
    const fields = [
      obj.firstName,
      obj.lastName1,
      obj.lastName2,
      obj.phone,
      obj.city,
      obj.postalCode,
    ];
    const completedFields = fields.filter(
      field => field !== undefined && field !== null && field !== '',
    ).length;
    return Math.round((completedFields / fields.length) * 100);
  })
  completionPercentage!: number;

  @Expose()
  @Transform(
    ({ obj }: { obj: Record<string, unknown> }) =>
      !!(obj.firstName && obj.lastName1 && obj.city),
  )
  isComplete!: boolean;
}
