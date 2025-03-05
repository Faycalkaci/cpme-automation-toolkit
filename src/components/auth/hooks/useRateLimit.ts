
import { useState, useEffect } from 'react';
import { rateLimitService } from '@/services/rateLimitService';

export const useRateLimit = () => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Vérifier le statut de blocage au chargement
  useEffect(() => {
    const checkRateLimit = () => {
      const blocked = rateLimitService.isBlocked();
      setIsBlocked(blocked);
      
      if (blocked) {
        setTimeRemaining(rateLimitService.getTimeRemaining());
      }
      
      setAttemptsLeft(5 - rateLimitService.getAttempts());
    };
    
    checkRateLimit();
    
    // Mettre à jour le compteur toutes les secondes
    const timer = setInterval(() => {
      if (rateLimitService.isBlocked()) {
        setTimeRemaining(rateLimitService.getTimeRemaining());
      } else if (isBlocked) {
        setIsBlocked(false);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isBlocked]);

  // Fonction pour réinitialiser le service après connexion réussie
  const resetOnSuccess = () => {
    rateLimitService.resetOnSuccess();
    setIsBlocked(false);
    setAttemptsLeft(5);
  };

  return {
    isBlocked,
    attemptsLeft,
    timeRemaining,
    resetOnSuccess
  };
};
