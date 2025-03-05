
import { firestoreService } from '@/services/firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export type FeatureType = 'documents' | 'spreadsheets' | 'templates' | 'emails';

export function useLicenseGuard(feature: FeatureType) {
  const { user } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLicense = async () => {
      if (!user) {
        setIsAuthorized(false);
        setIsLoading(false);
        toast.error('Accès refusé', {
          description: 'Vous devez être connecté pour accéder à cette fonctionnalité'
        });
        navigate('/');
        return;
      }

      // Super Admin bypass - ils ont accès à toutes les fonctionnalités sans licence
      if (user.role === 'super-admin') {
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      if (!user.organizationId) {
        setIsAuthorized(false);
        setIsLoading(false);
        toast.error('Accès refusé', {
          description: 'Vous devez être associé à une organisation pour accéder à cette fonctionnalité'
        });
        navigate('/');
        return;
      }

      try {
        // Find the organization's license
        const licenses = await firestoreService.licenses.getByCpme(user.organizationId);
        
        if (licenses.length === 0) {
          setIsAuthorized(false);
          toast.error('Licence introuvable', {
            description: 'Votre organisation ne possède pas de licence active'
          });
          navigate('/billing');
          return;
        }

        // Check if there's at least one active license
        const activeLicense = licenses.find(license => license.status === 'active');
        
        if (!activeLicense) {
          setIsAuthorized(false);
          toast.error('Licence expirée', {
            description: 'Votre licence a expiré. Veuillez la renouveler pour continuer'
          });
          navigate('/billing');
          return;
        }

        // Check feature restrictions based on plan
        if (feature === 'templates' && activeLicense.plan === 'standard') {
          setIsAuthorized(false);
          toast.error('Fonctionnalité non disponible', {
            description: 'L\'accès aux modèles nécessite un abonnement Pro ou Enterprise'
          });
          navigate('/billing');
          return;
        }

        // Checks passed, user is authorized
        setIsAuthorized(true);
      } catch (error) {
        console.error('Error checking license:', error);
        toast.error('Erreur d\'accès', {
          description: 'Une erreur est survenue lors de la vérification de votre licence'
        });
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLicense();
  }, [user, feature, navigate]);

  return { isAuthorized, isLoading };
}
