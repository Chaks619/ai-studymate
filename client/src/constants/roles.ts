// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

// Permissions
export const PERMISSIONS = {
  CREATE_QUIZ: 'create:quiz',
  DELETE_QUIZ: 'delete:quiz',
  MANAGE_USERS: 'manage:users',
  VIEW_ANALYTICS: 'view:analytics',
} as const;

// Role-Based Access
export const ROLE_PERMISSIONS = {
  [USER_ROLES.USER]: [PERMISSIONS.CREATE_QUIZ],
  [USER_ROLES.ADMIN]: Object.values(PERMISSIONS),
} as const;
