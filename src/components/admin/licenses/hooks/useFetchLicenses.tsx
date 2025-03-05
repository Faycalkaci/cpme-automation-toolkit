
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { License } from '@/services/firebase/firestore/types';
import { firestoreService } from '@/services/firebase/firestore';

export const useFetchLicenses = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const fetchLicenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const firebaseLicenses = await firestoreService.licenses.getAll();
      
      // Convert from Firestore format to our application format
      const formattedLicenses: License[] = firebaseLicenses.map(license => ({
        id: license.id || '',
        cpme: license.cpme,
        plan: license.plan as License['plan'],
        status: license.status,
        users: license.users,
        maxUsers: license.maxUsers,
        startDate: license.startDate,
        endDate: license.endDate
      }));
      
      setLicenses(formattedLicenses);
    } catch (error) {
      console.error('Erreur lors du chargement des licences:', error);
      
      let errorMessage = 'Impossible de charger les licences';
      if (error instanceof Error) {
        setError(error.message);
        
        if (error.message.includes('permission-denied')) {
          errorMessage = 'Vous n\'avez pas les droits nécessaires pour consulter les licences';
        } else if (error.message.includes('network')) {
          errorMessage = 'Problème de connexion au serveur';
        }
      }
      
      toast.error(errorMessage, {
        description: 'Des données de test sont affichées. Rechargez la page pour réessayer.'
      });
      
      // Use mock data in case of error
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
  }, []);

  // Allow manual refresh
  const refreshLicenses = () => {
    setRetryCount(prev => prev + 1);
  };

  // Load licenses from Firestore
  useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses, retryCount]);

  return {
    licenses,
    setLicenses,
    isLoading,
    error,
    refreshLicenses
  };
};
