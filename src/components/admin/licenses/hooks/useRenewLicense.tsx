
import { useState } from 'react';
import { toast } from 'sonner';
import { License } from '../types';
import { firestoreService } from '@/services/firebase/firestoreService';

export const useRenewLicense = (
  licenses: License[],
  setLicenses: React.Dispatch<React.SetStateAction<License[]>>
) => {
  const [isRenewing, setIsRenewing] = useState(false);
  const [renewError, setRenewError] = useState<string | null>(null);

  const renewLicense = async (licenseId: string) => {
    setIsRenewing(true);
    setRenewError(null);
    
    try {
      // Find license to renew
      const licenseToRenew = licenses.find(license => license.id === licenseId);
      
      if (!licenseToRenew) {
        throw new Error('license-not-found');
      }
      
      // Calculate new end date (one year more)
      const endDateString = licenseToRenew.endDate || '';
      if (!endDateString) {
        throw new Error('invalid-end-date');
      }
      
      const endDate = new Date(endDateString);
      if (isNaN(endDate.getTime())) {
        throw new Error('invalid-date-format');
      }
      
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
          // We continue without throwing as the Firestore update succeeded
          toast.warning('Licence renouvelée, mais problème avec Stripe', {
            description: 'Le renouvellement de l\'abonnement n\'a pas pu être traité automatiquement.'
          });
        }
      }
      
      toast.success('Licence renouvelée', {
        description: `La licence pour "${licenseToRenew.cpme}" a été prolongée d'un an.`
      });
    } catch (error) {
      console.error('Error renewing license:', error);
      
      let errorMessage = 'Erreur lors du renouvellement de la licence';
      if (error instanceof Error) {
        setRenewError(error.message);
        
        // Handle specific error cases
        if (error.message === 'license-not-found') {
          errorMessage = 'Licence introuvable';
        } else if (error.message === 'invalid-end-date') {
          errorMessage = 'La licence n\'a pas de date de fin valide';
        } else if (error.message === 'invalid-date-format') {
          errorMessage = 'Format de date invalide';
        } else if (error.message.includes('permission-denied')) {
          errorMessage = 'Vous n\'avez pas les droits nécessaires pour renouveler cette licence';
        } else if (error.message.includes('network')) {
          errorMessage = 'Problème de connexion. Vérifiez votre connexion internet et réessayez';
        }
      }
      
      toast.error(errorMessage, {
        description: 'Veuillez réessayer ou contacter l\'assistance technique si le problème persiste.'
      });
    } finally {
      setIsRenewing(false);
    }
  };

  return {
    renewLicense,
    isRenewing,
    renewError
  };
};
