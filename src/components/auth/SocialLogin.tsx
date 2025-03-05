
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
import { useFirebase } from '@/contexts/FirebaseContext';

export const SocialLogin: React.FC = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [domainError, setDomainError] = useState(false);
  const [corsError, setCorsError] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasFirestorePermissions } = useFirebase();

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setDomainError(false);
    setCorsError(false);
    
    try {
      console.log("Attempting Google login...");
      
      // Wrap the Google login in a try-catch to handle potential CORS issues
      let user;
      try {
        user = await firebaseAuth.loginWithGoogle();
      } catch (authError: any) {
        console.error("Google login error:", authError);
        // Handle specific CORS errors
        if (authError.message?.includes('Cross-Origin-Opener-Policy') || 
            authError.message?.includes('CORS')) {
          setCorsError(true);
          throw new Error("Google login CORS error: Please try another browser or disable ad blockers.");
        }
        throw authError;
      }
      
      if (!user || !user.email) {
        throw new Error("Incomplete user information");
      }
      
      console.log("Login successful, redirecting...");
      
      // Try to retrieve/update user profile if permissions allow
      if (hasFirestorePermissions) {
        try {
          let userProfile = await firestoreService.users.getByEmail(user.email);
          
          // Create profile if it doesn't exist
          if (!userProfile) {
            try {
              const newUser = {
                email: user.email,
                name: user.displayName || user.email.split('@')[0],
                role: 'user' as const,
                devices: [],
                lastLogin: Timestamp.now(),
                lastLocation: '',
                authProvider: 'google',
                uid: user.uid
              };
              
              const userId = await firestoreService.users.create(newUser);
              console.log("New user profile created:", userId);
            } catch (profileError) {
              console.warn("Cannot create user profile, but login continues:", profileError);
            }
          } else if (userProfile) {
            // Additional security check - compare UID
            if (userProfile.uid && userProfile.uid !== user.uid) {
              console.error("User ID mismatch detected");
              throw new Error("Security error: inconsistent credentials");
            }
            
            // Update existing profile
            try {
              await firestoreService.users.update(userProfile.id!, {
                lastLogin: Timestamp.now(),
                lastLocation: userProfile.lastLocation || '',
                authProvider: 'google'
              });
              console.log("User profile updated");
            } catch (updateError) {
              console.warn("Cannot update user profile, but login continues:", updateError);
            }
          }
        } catch (profileError) {
          console.warn("User profile access error, but login continues:", profileError);
        }
      } else {
        console.log("Firestore permissions denied - skipping profile update");
      }
      
      // Validate login and redirect
      toast({
        title: "Connexion Google réussie",
        description: "Vous êtes maintenant connecté"
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Google login error:', error);
      
      // Specific error detection
      if (error.code === 'auth/unauthorized-domain') {
        setDomainError(true);
        toast({
          title: "Domaine non autorisé",
          description: "Ce domaine n'est pas autorisé dans les paramètres Firebase. Veuillez contacter l'administrateur.",
          variant: "destructive"
        });
      } else if (corsError) {
        toast({
          title: "Erreur CORS",
          description: "Problème d'accès au service d'authentification. Essayez un autre navigateur ou désactivez les extensions de blocage.",
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

      {corsError && (
        <Alert variant="destructive" className="mt-4">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Erreur CORS détectée</AlertTitle>
          <AlertDescription>
            Une erreur de sécurité navigateur empêche la connexion. Essayez de désactiver les extensions de blocage
            ou utilisez un autre navigateur.
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
