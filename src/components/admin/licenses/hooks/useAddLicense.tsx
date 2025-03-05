
import { useState } from 'react';
import { toast } from 'sonner';
import { License } from '@/services/firebase/firestore/types';
import { firestoreService } from '@/services/firebase/firestore';
import { stripeService, PLANS } from '@/services/stripe/stripeService';

export const useAddLicense = (
  licenses: License[],
  setLicenses: React.Dispatch<React.SetStateAction<License[]>>
) => {
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const addLicense = async (license: Omit<License, 'id' | 'status' | 'users'>) => {
    setIsAdding(true);
    setAddError(null);
    
    try {
      if (!license.cpme || license.cpme.trim() === '') {
        throw new Error('missing-cpme');
      }
      
      if (!license.plan) {
        throw new Error('missing-plan');
      }
      
      // Check if a license with the same CPME already exists
      const existingLicense = licenses.find(l => 
        l.cpme?.toLowerCase() === license.cpme?.toLowerCase() && 
        l.status !== 'expired'
      );
      
      if (existingLicense) {
        throw new Error('duplicate-cpme');
      }
      
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
      
      // Configure Stripe webhook integration (this part only logs the integration point for now)
      try {
        // Get Stripe plan ID based on the plan
        const planId = PLANS[license.plan].id;
        
        // Note: actual Stripe subscription would happen here
        // The webhook handlers in Firebase Functions will process Stripe events
        console.log(`Stripe webhook setup for license ID: ${licenseId}, plan: ${planId}`);
        
      } catch (stripeError) {
        console.error('Error with Stripe integration:', stripeError);
        toast.warning('Licence créée, mais problème avec l\'intégration Stripe', {
          description: 'La configuration Stripe n\'a pas pu être complétée automatiquement.'
        });
      }
      
      const createdLicense = { ...newLicense, id: licenseId };
      
      // Update local state
      setLicenses([...licenses, createdLicense]);
      
      toast.success('Licence ajoutée avec succès', {
        description: `La licence pour "${newLicense.cpme}" a été créée.`
      });

      return createdLicense;
    } catch (error) {
      console.error('Error creating license:', error);
      
      let errorMessage = 'Erreur lors de la création de la licence';
      if (error instanceof Error) {
        setAddError(error.message);
        
        // Handle specific error cases
        if (error.message === 'missing-cpme') {
          errorMessage = 'Le nom de la CPME est obligatoire';
        } else if (error.message === 'missing-plan') {
          errorMessage = 'Le plan de la licence est obligatoire';
        } else if (error.message === 'duplicate-cpme') {
          errorMessage = 'Une licence active existe déjà pour cette CPME';
        } else if (error.message.includes('permission-denied')) {
          errorMessage = 'Vous n\'avez pas les droits nécessaires pour créer une licence';
        } else if (error.message.includes('network')) {
          errorMessage = 'Problème de connexion. Vérifiez votre connexion internet et réessayez';
        }
      }
      
      toast.error(errorMessage, {
        description: 'Veuillez vérifier les informations saisies et réessayer.'
      });
      
      throw error;
    } finally {
      setIsAdding(false);
    }
  };

  return {
    addLicense,
    isAdding,
    addError
  };
};
