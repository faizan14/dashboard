export const SUPER_ADMIN = 'SUPER_ADMIN';
export const ADMIN = 'ADMIN';

const ADMIN_ROLES = new Set([SUPER_ADMIN, ADMIN]);

export function isAdmin(role: string): boolean {
  return ADMIN_ROLES.has(role);
}
