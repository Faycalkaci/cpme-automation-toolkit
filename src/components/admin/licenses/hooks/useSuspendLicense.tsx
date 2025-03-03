
import { useState } from 'react';
import { toast } from 'sonner';
import { License } from '../types';
import { firestoreService } from '@/services/firebase/firestoreService';
import { stripeService } from '@/services/stripe/stripeService';

export const useSuspendLicense = (
  licenses: License[],
  setLicenses: React.Dispatch<React.SetStateAction<License[]>>
) => {
  const [isSuspending, setIsSuspending] = useState(false);

  const suspendLicense = async (licenseId: string) => {
    setIsSuspending(true);
    try {
      // Update in Firestore
      await firestoreService.licenses.update(licenseId, {
        status: 'expired'
      });
      
      // Update local state
      setLicenses(licenses.map(license => {
        if (license.id === licenseId) {
          return {
            ...license,
            status: 'expired'
          };
        }
        return license;
      }));
      
      // Find suspended license for Stripe operations
      const suspendedLicense = licenses.find(license => license.id === licenseId);
      
      // If license is linked to Stripe, suspend subscription
      if (suspendedLicense?.stripeSubscriptionId) {
        try {
          // Cancel Stripe subscription
          await stripeService.cancelSubscription(suspendedLicense.stripeSubscriptionId);
        } catch (stripeError) {
          console.error('Error suspending Stripe subscription:', stripeError);
        }
      }
      
      toast.success('License suspended', {
        description: `Access has been temporarily disabled.`
      });
    } catch (error) {
      console.error('Error suspending license:', error);
      toast.error('Error suspending license');
    } finally {
      setIsSuspending(false);
    }
  };

  return {
    suspendLicense,
    isSuspending
  };
};
