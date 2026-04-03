export const SUPER_ADMIN = 'SUPER_ADMIN';
export const TENANT_ADMIN = 'TENANT_ADMIN';
export const WMS_ADMIN = 'WMS_ADMIN';
export const SUPERVISOR = 'SUPERVISOR';
export const OPERATOR = 'OPERATOR';
export const VIEWER = 'VIEWER';

const ADMIN_ROLES = new Set([SUPER_ADMIN, TENANT_ADMIN, WMS_ADMIN]);

export function isAdmin(role: string): boolean {
  return ADMIN_ROLES.has(role);
}
