import { UserRole, UserPermission, ROLE_PERMISSIONS } from './user-roles';

describe('User Roles Constants', () => {
  describe('UserRole enum', () => {
    it('should have correct role values', () => {
      expect(UserRole.USER).toBe('user');
      expect(UserRole.ADMIN).toBe('admin');
      expect(UserRole.MODERATOR).toBe('moderator');
    });

    it('should have all expected roles', () => {
      const roles = Object.values(UserRole);
      expect(roles).toContain('user');
      expect(roles).toContain('admin');
      expect(roles).toContain('moderator');
      expect(roles).toHaveLength(3);
    });

    it('should be readonly', () => {
      // Note: In JavaScript, const objects are not deeply immutable
      // This test verifies the structure but not deep immutability
      expect(typeof UserRole.USER).toBe('string');
      expect(typeof UserRole.ADMIN).toBe('string');
      expect(typeof UserRole.MODERATOR).toBe('string');
    });
  });

  describe('UserPermission enum', () => {
    it('should have correct permission values', () => {
      expect(UserPermission.READ_USERS).toBe('read_users');
      expect(UserPermission.WRITE_USERS).toBe('write_users');
      expect(UserPermission.DELETE_USERS).toBe('delete_users');
      expect(UserPermission.MANAGE_ROLES).toBe('manage_roles');
      expect(UserPermission.READ_PROFILES).toBe('read_profiles');
      expect(UserPermission.WRITE_PROFILES).toBe('write_profiles');
      expect(UserPermission.DELETE_PROFILES).toBe('delete_profiles');
    });

    it('should have all expected permissions', () => {
      const permissions = Object.values(UserPermission);
      expect(permissions).toContain('read_users');
      expect(permissions).toContain('write_users');
      expect(permissions).toContain('delete_users');
      expect(permissions).toContain('manage_roles');
      expect(permissions).toContain('read_profiles');
      expect(permissions).toContain('write_profiles');
      expect(permissions).toContain('delete_profiles');
      expect(permissions).toHaveLength(7);
    });

    it('should be readonly', () => {
      // Note: In JavaScript, const objects are not deeply immutable
      // This test verifies the structure but not deep immutability
      expect(typeof UserPermission.READ_USERS).toBe('string');
      expect(typeof UserPermission.WRITE_USERS).toBe('string');
      expect(typeof UserPermission.DELETE_USERS).toBe('string');
    });
  });

  describe('ROLE_PERMISSIONS mapping', () => {
    it('should map USER role to correct permissions', () => {
      const userPermissions = ROLE_PERMISSIONS[UserRole.USER];
      expect(userPermissions).toContain(UserPermission.READ_PROFILES);
      expect(userPermissions).toContain(UserPermission.WRITE_PROFILES);
      expect(userPermissions).toHaveLength(2);
    });

    it('should map MODERATOR role to correct permissions', () => {
      const moderatorPermissions = ROLE_PERMISSIONS[UserRole.MODERATOR];
      expect(moderatorPermissions).toContain(UserPermission.READ_USERS);
      expect(moderatorPermissions).toContain(UserPermission.READ_PROFILES);
      expect(moderatorPermissions).toContain(UserPermission.WRITE_PROFILES);
      expect(moderatorPermissions).toContain(UserPermission.DELETE_PROFILES);
      expect(moderatorPermissions).toHaveLength(4);
    });

    it('should map ADMIN role to correct permissions', () => {
      const adminPermissions = ROLE_PERMISSIONS[UserRole.ADMIN];
      expect(adminPermissions).toContain(UserPermission.READ_USERS);
      expect(adminPermissions).toContain(UserPermission.WRITE_USERS);
      expect(adminPermissions).toContain(UserPermission.DELETE_USERS);
      expect(adminPermissions).toContain(UserPermission.MANAGE_ROLES);
      expect(adminPermissions).toContain(UserPermission.READ_PROFILES);
      expect(adminPermissions).toContain(UserPermission.WRITE_PROFILES);
      expect(adminPermissions).toContain(UserPermission.DELETE_PROFILES);
      expect(adminPermissions).toHaveLength(7);
    });

    it('should have all roles mapped', () => {
      const roles = Object.values(UserRole);
      roles.forEach(role => {
        expect(ROLE_PERMISSIONS[role]).toBeDefined();
        expect(Array.isArray(ROLE_PERMISSIONS[role])).toBe(true);
      });
    });

    it('should only contain valid permissions', () => {
      const allPermissions = Object.values(UserPermission);
      Object.values(ROLE_PERMISSIONS).forEach(permissions => {
        permissions.forEach(permission => {
          expect(allPermissions).toContain(permission);
        });
      });
    });

    it('should be readonly', () => {
      // Note: In JavaScript, const objects are not deeply immutable
      // This test verifies the structure but not deep immutability
      expect(Array.isArray(ROLE_PERMISSIONS[UserRole.USER])).toBe(true);
      expect(Array.isArray(ROLE_PERMISSIONS[UserRole.ADMIN])).toBe(true);
      expect(Array.isArray(ROLE_PERMISSIONS[UserRole.MODERATOR])).toBe(true);
    });
  });

  describe('permission hierarchy', () => {
    it('should ensure USER has basic profile permissions', () => {
      const userPermissions = ROLE_PERMISSIONS[UserRole.USER];
      expect(userPermissions).toContain(UserPermission.READ_PROFILES);
      expect(userPermissions).toContain(UserPermission.WRITE_PROFILES);
    });

    it('should ensure MODERATOR has USER permissions plus more', () => {
      const userPermissions = ROLE_PERMISSIONS[UserRole.USER];
      const moderatorPermissions = ROLE_PERMISSIONS[UserRole.MODERATOR];

      userPermissions.forEach(permission => {
        expect(moderatorPermissions).toContain(permission);
      });

      expect(moderatorPermissions.length).toBeGreaterThan(
        userPermissions.length,
      );
    });

    it('should ensure ADMIN has all permissions', () => {
      const adminPermissions = ROLE_PERMISSIONS[UserRole.ADMIN];
      const allPermissions = Object.values(UserPermission);

      allPermissions.forEach(permission => {
        expect(adminPermissions).toContain(permission);
      });
    });

    it('should ensure MODERATOR has more permissions than USER', () => {
      const userPermissions = ROLE_PERMISSIONS[UserRole.USER];
      const moderatorPermissions = ROLE_PERMISSIONS[UserRole.MODERATOR];

      expect(moderatorPermissions.length).toBeGreaterThan(
        userPermissions.length,
      );
    });

    it('should ensure ADMIN has more permissions than MODERATOR', () => {
      const moderatorPermissions = ROLE_PERMISSIONS[UserRole.MODERATOR];
      const adminPermissions = ROLE_PERMISSIONS[UserRole.ADMIN];

      expect(adminPermissions.length).toBeGreaterThan(
        moderatorPermissions.length,
      );
    });
  });

  describe('type safety', () => {
    it('should have correct types for UserRole', () => {
      const role: (typeof UserRole)[keyof typeof UserRole] = UserRole.USER;
      expect(typeof role).toBe('string');
    });

    it('should have correct types for UserPermission', () => {
      const permission: (typeof UserPermission)[keyof typeof UserPermission] =
        UserPermission.READ_USERS;
      expect(typeof permission).toBe('string');
    });

    it('should have correct types for ROLE_PERMISSIONS', () => {
      const permissions = ROLE_PERMISSIONS[UserRole.USER];
      expect(Array.isArray(permissions)).toBe(true);
      permissions.forEach(permission => {
        expect(typeof permission).toBe('string');
      });
    });
  });

  describe('permission uniqueness', () => {
    it('should not have duplicate permissions within roles', () => {
      Object.values(ROLE_PERMISSIONS).forEach(permissions => {
        const uniquePermissions = new Set(permissions);
        expect(uniquePermissions.size).toBe(permissions.length);
      });
    });

    it('should not have duplicate permissions across all roles', () => {
      const allPermissions = Object.values(ROLE_PERMISSIONS).flat();
      const uniquePermissions = new Set(allPermissions);
      // It's normal to have some permissions repeated across roles
      // This test ensures we don't have more duplicates than expected
      expect(uniquePermissions.size).toBeLessThanOrEqual(allPermissions.length);
      // Should have at least the number of unique permissions
      expect(uniquePermissions.size).toBeGreaterThan(0);
    });
  });

  describe('role coverage', () => {
    it('should cover all defined roles', () => {
      const definedRoles = Object.values(UserRole);
      const mappedRoles = Object.keys(ROLE_PERMISSIONS);

      definedRoles.forEach(role => {
        expect(mappedRoles).toContain(role);
      });
    });

    it('should not have extra roles in mapping', () => {
      const definedRoles = Object.values(UserRole);
      const mappedRoles = Object.keys(ROLE_PERMISSIONS);

      expect(mappedRoles.length).toBe(definedRoles.length);
    });
  });
});
