import { db } from '@/db/database';
import bcryptjs from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode('medix-hospital-management-secret-key-2026');
const TOKEN_EXPIRY = '24h';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  nameEn?: string;
  phone?: string;
  role: string;
  hospitalId?: string;
  departmentId?: string;
  status: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

export async function generateToken(user: AuthUser): Promise<string> {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    hospitalId: user.hospitalId,
    departmentId: user.departmentId,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, { clockTolerance: 60 });
    return {
      id: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      nameEn: payload.nameEn as string,
      role: payload.role as string,
      hospitalId: payload.hospitalId as string | undefined,
      departmentId: payload.departmentId as string | undefined,
      status: 'ACTIVE',
    };
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<{ user: AuthUser; token: string } | null> {
  const user = await db.users.where('email').equals(email).first();
  if (!user) return null;

  const valid = await comparePassword(password, user.password);
  if (!valid) return null;

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    nameEn: user.nameEn,
    role: user.role,
    hospitalId: user.hospitalId,
    departmentId: user.departmentId,
    status: user.status,
  };

  const token = await generateToken(authUser);

  await db.users.update(user.id, { lastLoginAt: new Date(), updatedAt: new Date() });

  return { user: authUser, token };
}

export function logout(): void {
  localStorage.removeItem('medix_token');
}

export function getStoredToken(): string | null {
  return localStorage.getItem('medix_token');
}

export function storeToken(token: string): void {
  localStorage.setItem('medix_token', token);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = getStoredToken();
  if (!token) return null;
  return verifyToken(token);
}

export const PERMISSIONS: Record<string, Record<string, string[]>> = {
  hospitals: { read: ['SUPER_ADMIN'], create: ['SUPER_ADMIN'], update: ['SUPER_ADMIN'], delete: ['SUPER_ADMIN'] },
  users: { read: ['SUPER_ADMIN', 'HOSPITAL_ADMIN'], create: ['SUPER_ADMIN', 'HOSPITAL_ADMIN'], update: ['SUPER_ADMIN', 'HOSPITAL_ADMIN'], delete: ['SUPER_ADMIN', 'HOSPITAL_ADMIN'] },
  patients: { read: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'], create: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'RECEPTIONIST'], update: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'], delete: ['SUPER_ADMIN', 'HOSPITAL_ADMIN'] },
  appointments: { read: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'RECEPTIONIST'], create: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'RECEPTIONIST'], update: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'RECEPTIONIST'], delete: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'RECEPTIONIST'] },
  beds: { read: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'NURSE'], update: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'NURSE'] },
  inventory: { read: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'PHARMACIST'], create: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'PHARMACIST'], update: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'PHARMACIST'] },
  reports: { read: ['SUPER_ADMIN', 'HOSPITAL_ADMIN'] },
  auditLogs: { read: ['SUPER_ADMIN', 'HOSPITAL_ADMIN'] },
};

export function hasPermission(role: string, resource: string, action: string): boolean {
  const perm = PERMISSIONS[resource];
  if (!perm) return false;
  const allowed = perm[action] || [];
  return allowed.includes(role);
}

export function canAccessHospital(userRole: string, userHospitalId: string | undefined, targetHospitalId: string): boolean {
  if (userRole === 'SUPER_ADMIN') return true;
  return userHospitalId === targetHospitalId;
}
