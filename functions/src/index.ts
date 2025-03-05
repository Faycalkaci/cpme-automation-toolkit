
import * as admin from 'firebase-admin';
import { checkExpiredLicenses } from './licenses/checkExpiredLicenses';
import { stripeWebhooks } from './webhooks/stripeWebhooks';

// Initialize Firebase admin
admin.initializeApp();

// Export all functions
export { 
  checkExpiredLicenses,
  stripeWebhooks
};
