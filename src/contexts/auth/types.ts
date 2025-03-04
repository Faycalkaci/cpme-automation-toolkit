
import { Timestamp } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';

export type UserRole = 'super-admin' | 'admin' | 'user' | null;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
  devices?: string[];
  lastLogin?: Timestamp | string;
  lastLocation?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<FirebaseUser | null>; // Typed correctly
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  enableTwoFactorAuth: () => Promise<void>;
  verifyTwoFactorCode: (code: string) => Promise<boolean>;
  isTwoFactorEnabled: boolean;
  checkDeviceLimit: () => boolean;
  getDeviceCount: () => number;
  MAX_DEVICES: number;
}
