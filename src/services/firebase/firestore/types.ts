
import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  id?: string;
  email: string;
  name: string;
  role: 'super-admin' | 'admin' | 'user' | null;
  organizationId?: string;
  organizationName?: string;
  devices?: string[];
  lastLogin?: Timestamp | string;
  lastLocation?: string;
  authProvider?: 'google' | 'email' | 'apple' | string;
  uid?: string; // Identifiant unique Firebase Auth
  hasPaid?: boolean; // New property to track payment status
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface License {
  id?: string;
  cpme: string;
  plan: 'standard' | 'pro' | 'enterprise';
  status: 'active' | 'expired' | 'pending';
  users: number;
  maxUsers: number;
  startDate: string;
  endDate: string;
  stripeSubscriptionId?: string;
  customerId?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface AutomationLog {
  id?: string;
  type: string;
  details: any;
  status: 'success' | 'error' | 'pending';
  userId?: string;
  timestamp: Timestamp;
}
