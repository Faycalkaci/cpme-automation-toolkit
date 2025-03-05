
import { UserService } from './userService';
import { LicenseService } from './licenseService';
import { AutomationLogService } from './automationLogService';
import { TemplateService } from './templateService';
import { DataService } from './data/dataService';
import { db } from '../firebaseService';

// Re-export types
export * from './types';
export * from './data/types';

// Create and export service instances
export const firestoreService = {
  users: new UserService(db),
  licenses: new LicenseService(db),
  automationLogs: new AutomationLogService(db),
  templates: new TemplateService(db),
  data: new DataService(db)
};
