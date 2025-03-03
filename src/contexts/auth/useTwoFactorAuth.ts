
import { useState } from 'react';

export const useTwoFactorAuth = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsTwoFactorEnabled: React.Dispatch<React.SetStateAction<boolean>>,
  toast: any
) => {
  // Enable 2FA
  const enableTwoFactorAuth = async () => {
    setIsLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsTwoFactorEnabled(true);
      
      toast({
        title: "2FA activée",
        description: "L'authentification à deux facteurs a été activée pour votre compte.",
      });
      
      return;
    } catch (error) {
      console.error('Erreur d\'activation 2FA:', error);
      toast({
        title: "Échec de l'activation",
        description: "Impossible d'activer l'authentification à deux facteurs. Veuillez réessayer.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify 2FA code
  const verifyTwoFactorCode = async (code: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pour la démo, n'importe quel code à 6 chiffres est valide
      const isValid = /^\d{6}$/.test(code);
      
      if (isValid) {
        toast({
          title: "Code validé",
          description: "Code d'authentification validé avec succès.",
        });
      } else {
        toast({
          title: "Code invalide",
          description: "Le code d'authentification est invalide. Veuillez réessayer.",
          variant: "destructive"
        });
      }
      
      return isValid;
    } catch (error) {
      console.error('Erreur de vérification du code:', error);
      toast({
        title: "Erreur de vérification",
        description: "Impossible de vérifier le code. Veuillez réessayer.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    enableTwoFactorAuth,
    verifyTwoFactorCode
  };
};
