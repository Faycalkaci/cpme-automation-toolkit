
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
  const [error, setError] = useState<string | null>(null);

  const suspendLicense = async (licenseId: string) => {
    setIsSuspending(true);
    setError(null);
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
          toast.error('Attention : La licence a été suspendue mais un problème est survenu avec l\'abonnement Stripe', {
            description: 'Une intervention manuelle pourrait être nécessaire.'
          });
          // We continue without throwing, as the Firestore update succeeded
        }
      }
      
      toast.success('Licence suspendue', {
        description: `L'accès a été temporairement désactivé pour "${suspendedLicense?.cpme || 'la CPME'}."`
      });
    } catch (error) {
      console.error('Error suspending license:', error);
      
      // Provide more detailed error information
      let errorMessage = 'Erreur lors de la suspension de la licence';
      if (error instanceof Error) {
        setError(error.message);
        
        // More specific error handling based on error type or message
        if (error.message.includes('permission-denied')) {
          errorMessage = 'Vous n\'avez pas les droits nécessaires pour suspendre cette licence';
        } else if (error.message.includes('not-found')) {
          errorMessage = 'Cette licence n\'existe plus ou a déjà été supprimée';
        } else if (error.message.includes('network')) {
          errorMessage = 'Problème de connexion. Vérifiez votre connexion internet et réessayez';
        }
      }
      
      toast.error(errorMessage, {
        description: 'Veuillez réessayer ou contacter l\'assistance technique si le problème persiste.'
      });
    } finally {
      setIsSuspending(false);
    }
  };

  return {
    suspendLicense,
    isSuspending,
    suspensionError: error
  };
};
