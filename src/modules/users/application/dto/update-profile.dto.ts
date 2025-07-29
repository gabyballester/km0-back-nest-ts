import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';

/**
 * DTO for updating a user profile
 * Extends CreateProfileDto with all fields optional
 */
export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
