import axiosInstance from './axiosInstance';
import { hashPassword } from '../utils/crypto';

const MOCK_API = import.meta.env.VITE_MOCK_API === 'true';

export interface LoginResponse {
  token: string;
  name: string;
  role: string;
  tenant: string;
  forcePasswordChange: boolean;
}

const MOCK_LOGIN_RESPONSE: LoginResponse = {
  token: 'mock-jwt-token-abc123',
  name: 'Amministratore Sistema',
  role: 'SUPER_ADMIN',
  tenant: 'DEFAULT',
  forcePasswordChange: false,
};

export async function login(username: string, password: string): Promise<LoginResponse> {
  if (MOCK_API) {
    await new Promise((r) => setTimeout(r, 500));
    return { ...MOCK_LOGIN_RESPONSE };
  }

  const hashedPassword = await hashPassword(password);
  const { data } = await axiosInstance.post<LoginResponse>('/api/v1/auth/login', {
    username,
    password: hashedPassword,
  });
  return data;
}

export async function changePassword(
  oldPassword: string,
  newPassword: string,
): Promise<void> {
  if (MOCK_API) {
    await new Promise((r) => setTimeout(r, 500));
    return;
  }

  const [hashedOld, hashedNew] = await Promise.all([
    hashPassword(oldPassword),
    hashPassword(newPassword),
  ]);
  await axiosInstance.post('/api/v1/auth/change-password', {
    oldPassword: hashedOld,
    newPassword: hashedNew,
  });
}
