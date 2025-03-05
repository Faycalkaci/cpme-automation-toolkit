
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { firebaseAuth } from '@/services/firebase/firebaseService';
import { firestoreService } from '@/services/firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { useFirebase } from '@/contexts/FirebaseContext';

export function useGoogleAuth() {
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

  return {
    googleLoading,
    domainError,
    corsError,
    handleGoogleLogin
  };
}
