
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { firebaseAuth } from '@/services/firebase/firebaseService';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { firestoreService } from '@/services/firebase/firestore';
import { Timestamp } from 'firebase/firestore';

export const SocialLogin: React.FC = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [domainError, setDomainError] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setDomainError(false);
    try {
      console.log("Tentative de connexion Google...");
      const user = await firebaseAuth.loginWithGoogle();
      
      if (!user || !user.email) {
        throw new Error("Informations utilisateur incomplètes");
      }
      
      console.log("Connexion réussie, redirection...");
      
      // Essayer de récupérer le profil utilisateur, mais ne pas bloquer si ça échoue
      try {
        let userProfile = await firestoreService.users.getByEmail(user.email);
        
        // Créer un profil s'il n'existe pas
        if (!userProfile) {
          try {
            const newUser = {
              email: user.email,
              name: user.displayName || user.email.split('@')[0],
              role: 'user' as const,
              devices: [],
              lastLogin: Timestamp.now(),
              lastLocation: '',
              // Stockage du fournisseur d'authentification pour sécurité
              authProvider: 'google',
              // Stockage de l'ID unique de l'utilisateur
              uid: user.uid
            };
            
            const userId = await firestoreService.users.create(newUser);
            console.log("Nouveau profil utilisateur créé:", userId);
          } catch (profileError) {
            console.warn("Impossible de créer le profil utilisateur, mais la connexion continue:", profileError);
          }
        } else if (userProfile) {
          // Vérification supplémentaire de sécurité - comparaison de l'UID
          if (userProfile.uid && userProfile.uid !== user.uid) {
            console.error("Incohérence d'identifiants détectée");
            throw new Error("Erreur de sécurité: identifiants incohérents");
          }
          
          // Mettre à jour le profil existant
          try {
            await firestoreService.users.update(userProfile.id!, {
              lastLogin: Timestamp.now(),
              lastLocation: userProfile.lastLocation || '',
              // Mise à jour du fournisseur au cas où il aurait changé
              authProvider: 'google'
            });
            console.log("Profil utilisateur mis à jour");
          } catch (updateError) {
            console.warn("Impossible de mettre à jour le profil utilisateur, mais la connexion continue:", updateError);
          }
        }
      } catch (profileError) {
        console.warn("Erreur lors de l'accès au profil utilisateur, mais la connexion continue:", profileError);
      }
      
      // Valider la connexion et rediriger l'utilisateur
      toast({
        title: "Connexion Google réussie",
        description: "Vous êtes maintenant connecté"
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Google login error:', error);
      
      // Détection spécifique de l'erreur de domaine non autorisé
      if (error.code === 'auth/unauthorized-domain') {
        setDomainError(true);
        toast({
          title: "Domaine non autorisé",
          description: "Ce domaine n'est pas autorisé dans les paramètres Firebase. Veuillez contacter l'administrateur.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Échec de la connexion Google",
          description: error.message || "Une erreur s'est produite lors de la connexion avec Google.",
          variant: "destructive"
        });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <div className="mt-4 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white text-slate-500">ou</span>
        </div>
      </div>

      {domainError && (
        <Alert variant="destructive" className="mt-4">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Domaine non autorisé</AlertTitle>
          <AlertDescription>
            Le domaine actuel n'est pas autorisé dans les paramètres de votre projet Firebase. 
            Ajoutez "{window.location.hostname}" dans la liste des domaines autorisés de votre console Firebase.
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-4">
        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <Spinner size="sm" className="mr-2" />
          ) : (
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
          )}
          Continuer avec Google
        </Button>
      </div>
    </>
  );
};
