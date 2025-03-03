
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { License } from './types';
import { firestoreService } from '@/services/firebase/firestoreService';
import { stripeService, PLANS } from '@/services/stripe/stripeService';

export const useLicenses = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les licences depuis Firestore
  useEffect(() => {
    const fetchLicenses = async () => {
      setIsLoading(true);
      try {
        const firebaseLicenses = await firestoreService.licenses.getAll();
        
        // Convertir du format Firestore au format de notre application
        const formattedLicenses: License[] = firebaseLicenses.map(license => ({
          id: license.id || '',
          cpme: license.cpme,
          plan: license.plan,
          status: license.status,
          users: license.users,
          maxUsers: license.maxUsers,
          startDate: license.startDate,
          endDate: license.endDate
        }));
        
        setLicenses(formattedLicenses);
      } catch (error) {
        console.error('Erreur lors du chargement des licences:', error);
        toast.error('Impossible de charger les licences');
        
        // Utiliser les données mockées en cas d'erreur
        setLicenses([
          {
            id: '1',
            cpme: 'CPME Seine-Saint-Denis (93)',
            plan: 'enterprise',
            status: 'active',
            users: 3,
            maxUsers: 3,
            startDate: '2023-01-15',
            endDate: '2024-01-15'
          },
          {
            id: '2',
            cpme: 'CPME Paris (75)',
            plan: 'pro',
            status: 'active',
            users: 1,
            maxUsers: 1,
            startDate: '2023-03-22',
            endDate: '2024-03-22'
          },
          {
            id: '3',
            cpme: 'CPME Val-de-Marne (94)',
            plan: 'standard',
            status: 'expired',
            users: 1,
            maxUsers: 1,
            startDate: '2023-02-10',
            endDate: '2023-12-10'
          },
          {
            id: '4',
            cpme: 'CPME Hauts-de-Seine (92)',
            plan: 'pro',
            status: 'pending',
            users: 0,
            maxUsers: 1,
            startDate: '2024-01-01',
            endDate: '2025-01-01'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLicenses();
  }, []);

  const addLicense = async (license: Omit<License, 'id' | 'status' | 'users'>) => {
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
      
      // Ajouter à Firestore
      const licenseId = await firestoreService.licenses.create(newLicense as any);
      
      // Créer l'abonnement Stripe (à connecter si Stripe est configuré)
      try {
        // Obtenir l'ID de plan Stripe en fonction du plan
        const planId = PLANS[license.plan].id;
        
        // Créer une session de paiement (à implémenter plus tard pour la création réelle)
        // Cette partie n'est pas essentielle pour le fonctionnement de base
        console.log(`Création d'un abonnement Stripe pour le plan: ${planId}`);
      } catch (stripeError) {
        console.error('Erreur lors de la création de l\'abonnement Stripe:', stripeError);
      }
      
      const createdLicense = { ...newLicense, id: licenseId };
      
      // Mettre à jour l'état local
      setLicenses([...licenses, createdLicense]);
      
      toast.success('Licence ajoutée avec succès', {
        description: `La licence pour "${newLicense.cpme}" a été créée.`
      });

      return createdLicense;
    } catch (error) {
      console.error('Erreur lors de la création de la licence:', error);
      toast.error('Erreur lors de la création de la licence');
      throw error;
    }
  };
  
  const renewLicense = async (licenseId: string) => {
    try {
      // Trouver la licence à renouveler
      const licenseToRenew = licenses.find(license => license.id === licenseId);
      
      if (!licenseToRenew) {
        throw new Error('Licence non trouvée');
      }
      
      // Calculer la nouvelle date de fin (un an de plus)
      const newEndDate = new Date(new Date(licenseToRenew.endDate).setFullYear(new Date(licenseToRenew.endDate).getFullYear() + 1)).toISOString().split('T')[0];
      
      // Mettre à jour dans Firestore
      await firestoreService.licenses.update(licenseId, {
        status: 'active',
        endDate: newEndDate
      });
      
      // Mettre à jour l'état local
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
      
      // Si la licence est liée à Stripe, renouveler l'abonnement
      if (licenseToRenew.stripeSubscriptionId) {
        try {
          // Code pour renouveler l'abonnement Stripe ici (à implémenter)
          console.log(`Renouvellement de l'abonnement Stripe: ${licenseToRenew.stripeSubscriptionId}`);
        } catch (stripeError) {
          console.error('Erreur lors du renouvellement de l\'abonnement Stripe:', stripeError);
        }
      }
      
      toast.success('Licence renouvelée', {
        description: `La licence a été prolongée d'un an.`
      });
    } catch (error) {
      console.error('Erreur lors du renouvellement de la licence:', error);
      toast.error('Erreur lors du renouvellement de la licence');
    }
  };
  
  const suspendLicense = async (licenseId: string) => {
    try {
      // Mettre à jour dans Firestore
      await firestoreService.licenses.update(licenseId, {
        status: 'expired'
      });
      
      // Mettre à jour l'état local
      setLicenses(licenses.map(license => {
        if (license.id === licenseId) {
          return {
            ...license,
            status: 'expired'
          };
        }
        return license;
      }));
      
      // Trouver la licence suspendue pour les opérations Stripe
      const suspendedLicense = licenses.find(license => license.id === licenseId);
      
      // Si la licence est liée à Stripe, suspendre l'abonnement
      if (suspendedLicense?.stripeSubscriptionId) {
        try {
          // Annuler l'abonnement Stripe
          await stripeService.cancelSubscription(suspendedLicense.stripeSubscriptionId);
        } catch (stripeError) {
          console.error('Erreur lors de la suspension de l\'abonnement Stripe:', stripeError);
        }
      }
      
      toast.success('Licence suspendue', {
        description: `L'accès a été temporairement désactivé.`
      });
    } catch (error) {
      console.error('Erreur lors de la suspension de la licence:', error);
      toast.error('Erreur lors de la suspension de la licence');
    }
  };

  return {
    licenses,
    isLoading,
    addLicense,
    renewLicense,
    suspendLicense
  };
};
