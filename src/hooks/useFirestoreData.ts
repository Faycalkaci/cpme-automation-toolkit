
import { useState, useEffect } from 'react';
import { firestoreService, UserProfile, License } from '@/services/firebase/firestoreService';
import { useToast } from '@/components/ui/use-toast';
import { useFirebase } from '@/contexts/FirebaseContext';

interface UseFirestoreDataProps<T> {
  fetchMethod: () => Promise<T[]>;
  collection: string;
  dependencies?: any[];
}

export function useFirestoreData<T>({ 
  fetchMethod, 
  collection, 
  dependencies = [] 
}: UseFirestoreDataProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { userProfile } = useFirebase();

  // Check if user has permission to access this collection
  const hasPermission = () => {
    if (!userProfile) return false;
    
    // Super admins can access everything
    if (userProfile.role === 'super-admin') return true;
    
    // Regular admins can access most things except super admin specific collections
    if (userProfile.role === 'admin') {
      return true;
    }
    
    // Users can only access data related to their organization
    return ['documents', 'templates'].includes(collection);
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (!hasPermission()) {
        setError('Vous n\'avez pas les permissions nécessaires pour accéder à ces données.');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await fetchMethod();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        console.error(`Erreur lors du chargement des ${collection}:`, err);
        if (isMounted) {
          setError(`Impossible de charger les ${collection}.`);
          toast({
            title: "Erreur de chargement",
            description: `Impossible de charger les ${collection} depuis Firebase.`,
            variant: "destructive"
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [...dependencies, userProfile?.id]);

  return { data, isLoading, error, refreshData: () => setData([]) };
}

// Specific hooks for different collections
export const useUsers = (dependencies = []) => {
  return useFirestoreData<UserProfile>({
    fetchMethod: firestoreService.users.getAll,
    collection: 'users',
    dependencies
  });
};

export const useLicenses = (dependencies = []) => {
  return useFirestoreData<License>({
    fetchMethod: firestoreService.licenses.getAll,
    collection: 'licenses',
    dependencies
  });
};
