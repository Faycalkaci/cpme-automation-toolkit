
import { useState } from 'react';
import { toast } from 'sonner';
import { License } from '../types';
import { firestoreService } from '@/services/firebase/firestoreService';
import { stripeService, PLANS } from '@/services/stripe/stripeService';

export const useAddLicense = (
  licenses: License[],
  setLicenses: React.Dispatch<React.SetStateAction<License[]>>
) => {
  const [isAdding, setIsAdding] = useState(false);

  const addLicense = async (license: Omit<License, 'id' | 'status' | 'users'>) => {
    setIsAdding(true);
    try {
      // Update max users based on plan
      let maxUsers = 1; // Default for standard and pro
      if (license.plan === 'enterprise') {
        maxUsers = 3;
      }
      
      const newLicense: Omit<License, 'id'> = {
        cpme: license.cpme,
        plan: license.plan,
        status: 'active',
        users: 0,
        maxUsers,
        startDate: license.startDate,
        endDate: license.endDate
      };
      
      // Add to Firestore
      const licenseId = await firestoreService.licenses.create(newLicense as any);
      
      // Create Stripe subscription (to be connected if Stripe is configured)
      try {
        // Get Stripe plan ID based on the plan
        const planId = PLANS[license.plan].id;
        
        // Create a payment session (to be implemented later for actual creation)
        // This part is not essential for basic functionality
        console.log(`Creating a Stripe subscription for plan: ${planId}`);
      } catch (stripeError) {
        console.error('Error creating Stripe subscription:', stripeError);
      }
      
      const createdLicense = { ...newLicense, id: licenseId };
      
      // Update local state
      setLicenses([...licenses, createdLicense]);
      
      toast.success('License added successfully', {
        description: `The license for "${newLicense.cpme}" has been created.`
      });

      return createdLicense;
    } catch (error) {
      console.error('Error creating license:', error);
      toast.error('Error creating license');
      throw error;
    } finally {
      setIsAdding(false);
    }
  };

  return {
    addLicense,
    isAdding
  };
};
