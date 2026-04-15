/**
 * Role-Based Access Control (RBAC) Configuration
 *
 * Defines permissions per role. Designed to be easily extended
 * with new roles or permissions without changing middleware logic.
 */

const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
};

const PERMISSIONS = {
  // User management
  CREATE_USER: "create:user",
  READ_ALL_USERS: "read:all_users",
  READ_USER: "read:user",
  UPDATE_ANY_USER: "update:any_user",
  UPDATE_OWN_PROFILE: "update:own_profile",
  DELETE_USER: "delete:user",
  CHANGE_ROLE: "change:role",
  CHANGE_STATUS: "change:status",
};

// Map each role to its allowed permissions
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.READ_ALL_USERS,
    PERMISSIONS.READ_USER,
    PERMISSIONS.UPDATE_ANY_USER,
    PERMISSIONS.UPDATE_OWN_PROFILE,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.CHANGE_ROLE,
    PERMISSIONS.CHANGE_STATUS,
  ],
  [ROLES.MANAGER]: [
    PERMISSIONS.READ_ALL_USERS,
    PERMISSIONS.READ_USER,
    PERMISSIONS.UPDATE_ANY_USER, // but restricted in service layer — cannot touch admins
    PERMISSIONS.UPDATE_OWN_PROFILE,
  ],
  [ROLES.USER]: [PERMISSIONS.UPDATE_OWN_PROFILE],
};

/**
 * Check if a role has a specific permission
 * @param {string} role
 * @param {string} permission
 * @returns {boolean}
 */
const hasPermission = (role, permission) => {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes(permission);
};

module.exports = { ROLES, PERMISSIONS, ROLE_PERMISSIONS, hasPermission };
