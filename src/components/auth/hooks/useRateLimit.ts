
import { useState, useEffect } from 'react';
import { rateLimitService } from '@/services/rateLimitService';

export const useRateLimit = () => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);

  // Vérifier le statut de blocage et captcha au chargement
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
    
    // Vérifier si le captcha doit être affiché
    setShowCaptcha(rateLimitService.shouldShowCaptcha());
    
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

  // Fonction pour enregistrer une tentative
  const recordAttempt = () => {
    const rateLimit = rateLimitService.recordAttempt();
    setAttemptsLeft(rateLimit.attemptsLeft);
    
    if (rateLimit.blocked) {
      setIsBlocked(true);
      setTimeRemaining(rateLimitService.getTimeRemaining());
      return true; // indique que l'utilisateur est bloqué
    }
    
    // Vérifier si le captcha doit être affiché après cette tentative
    setShowCaptcha(rateLimitService.shouldShowCaptcha());
    return false; // indique que l'utilisateur n'est pas bloqué
  };

  // Fonction pour réinitialiser le service après connexion réussie
  const resetOnSuccess = () => {
    rateLimitService.resetOnSuccess();
    setIsBlocked(false);
    setAttemptsLeft(5);
    setShowCaptcha(false);
  };

  return {
    isBlocked,
    attemptsLeft,
    timeRemaining,
    showCaptcha,
    recordAttempt,
    resetOnSuccess
  };
};
