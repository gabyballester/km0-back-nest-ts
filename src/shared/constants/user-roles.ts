/**
 * Roles de usuario para el sistema
 */
export const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
} as const;

/**
 * Permisos disponibles en el sistema
 */
export const UserPermission = {
  READ_USERS: 'read_users',
  WRITE_USERS: 'write_users',
  DELETE_USERS: 'delete_users',
  MANAGE_ROLES: 'manage_roles',
  READ_PROFILES: 'read_profiles',
  WRITE_PROFILES: 'write_profiles',
  DELETE_PROFILES: 'delete_profiles',
} as const;

/**
 * Mapeo de roles a permisos
 */
export const ROLE_PERMISSIONS = {
  [UserRole.USER]: [
    UserPermission.READ_PROFILES,
    UserPermission.WRITE_PROFILES,
  ],
  [UserRole.MODERATOR]: [
    UserPermission.READ_USERS,
    UserPermission.READ_PROFILES,
    UserPermission.WRITE_PROFILES,
    UserPermission.DELETE_PROFILES,
  ],
  [UserRole.ADMIN]: [
    UserPermission.READ_USERS,
    UserPermission.WRITE_USERS,
    UserPermission.DELETE_USERS,
    UserPermission.MANAGE_ROLES,
    UserPermission.READ_PROFILES,
    UserPermission.WRITE_PROFILES,
    UserPermission.DELETE_PROFILES,
  ],
} as const;
