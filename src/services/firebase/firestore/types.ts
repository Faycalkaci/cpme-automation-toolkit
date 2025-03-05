
import { Timestamp } from 'firebase/firestore';

// License types
export interface License {
  id: string;
  cpme: string;
  plan: 'standard' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'expired';
  users: number;
  maxUsers: number;
  startDate: string;
  endDate: string;
  stripeSubscriptionId?: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin' | 'super-admin';
  organizationId?: string;
  createdAt: Date | Timestamp;
  lastLogin?: Date | Timestamp;
}

// AutomationLog types
export interface AutomationLog {
  id: string;
  type: 'email' | 'document' | 'reminder';
  status: 'success' | 'error';
  message: string;
  metadata?: Record<string, any>;
  userId?: string;
  createdAt: Date | Timestamp;
}
