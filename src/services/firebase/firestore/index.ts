
import { UserService } from './userService';
import { LicenseService } from './licenseService';
import { AutomationLogService } from './automationLogService';
import { db } from '../firebaseService';

// Re-export types
export * from './types';

// Create and export service instances
export const firestoreService = {
  users: new UserService(db),
  licenses: new LicenseService(db),
  automationLogs: new AutomationLogService(db)
};
