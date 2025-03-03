
import { useState } from 'react';
import { toast } from 'sonner';
import { License } from '../types';
import { firestoreService } from '@/services/firebase/firestoreService';

export const useRenewLicense = (
  licenses: License[],
  setLicenses: React.Dispatch<React.SetStateAction<License[]>>
) => {
  const [isRenewing, setIsRenewing] = useState(false);

  const renewLicense = async (licenseId: string) => {
    setIsRenewing(true);
    try {
      // Find license to renew
      const licenseToRenew = licenses.find(license => license.id === licenseId);
      
      if (!licenseToRenew) {
        throw new Error('License not found');
      }
      
      // Calculate new end date (one year more)
      const endDateString = licenseToRenew.endDate || '';
      if (!endDateString) {
        throw new Error('License does not have a valid end date');
      }
      
      const endDate = new Date(endDateString);
      const newEndDate = new Date(endDate.setFullYear(endDate.getFullYear() + 1))
        .toISOString().split('T')[0];
      
      // Update in Firestore
      await firestoreService.licenses.update(licenseId, {
        status: 'active',
        endDate: newEndDate
      });
      
      // Update local state
      setLicenses(licenses.map(license => {
        if (license.id === licenseId) {
          return {
            ...license,
            status: 'active',
            endDate: newEndDate
          };
        }
        return license;
      }));
      
      // If license is linked to Stripe, renew subscription
      if (licenseToRenew.stripeSubscriptionId) {
        try {
          // Code to renew Stripe subscription here (to be implemented)
          console.log(`Renewing Stripe subscription: ${licenseToRenew.stripeSubscriptionId}`);
        } catch (stripeError) {
          console.error('Error renewing Stripe subscription:', stripeError);
        }
      }
      
      toast.success('License renewed', {
        description: `The license has been extended for one year.`
      });
    } catch (error) {
      console.error('Error renewing license:', error);
      toast.error('Error renewing license');
    } finally {
      setIsRenewing(false);
    }
  };

  return {
    renewLicense,
    isRenewing
  };
};
