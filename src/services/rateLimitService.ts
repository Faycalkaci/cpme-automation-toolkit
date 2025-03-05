
// Service de limitation des requêtes d'authentification
const RATE_LIMIT_KEY = 'auth-rate-limit';
const MAX_ATTEMPTS = 5; // Nombre maximal de tentatives
const COOLDOWN_TIME = 5 * 60 * 1000; // 5 minutes en millisecondes

interface RateLimitData {
  attempts: number;
  timestamp: number;
  blocked: boolean;
}

export const rateLimitService = {
  /**
   * Vérifie si l'utilisateur est bloqué en raison de trop nombreuses tentatives
   */
  isBlocked: (): boolean => {
    const data = getRateLimitData();
    
    // Si le temps de blocage est écoulé, réinitialiser
    if (data.blocked && Date.now() - data.timestamp > COOLDOWN_TIME) {
      resetRateLimit();
      return false;
    }
    
    return data.blocked;
  },

  /**
   * Enregistre une tentative de connexion
   * @returns Un objet contenant le statut du blocage et les tentatives restantes
   */
  recordAttempt: (): { blocked: boolean; attemptsLeft: number } => {
    const data = getRateLimitData();
    
    // Si déjà bloqué, vérifier si le temps de blocage est écoulé
    if (data.blocked) {
      if (Date.now() - data.timestamp > COOLDOWN_TIME) {
        resetRateLimit();
        const newData = getRateLimitData();
        newData.attempts += 1;
        saveRateLimitData(newData);
        return { blocked: false, attemptsLeft: MAX_ATTEMPTS - newData.attempts };
      }
      return { blocked: true, attemptsLeft: 0 };
    }
    
    // Incrémenter le compteur de tentatives
    data.attempts += 1;
    data.timestamp = Date.now();
    
    // Bloquer si le nombre maximal de tentatives est atteint
    if (data.attempts >= MAX_ATTEMPTS) {
      data.blocked = true;
    }
    
    saveRateLimitData(data);
    
    return {
      blocked: data.blocked,
      attemptsLeft: data.blocked ? 0 : MAX_ATTEMPTS - data.attempts
    };
  },

  /**
   * Réinitialise le compteur de tentatives après une connexion réussie
   */
  resetOnSuccess: (): void => {
    resetRateLimit();
  },
  
  /**
   * Obtient le temps restant en secondes avant la fin du blocage
   */
  getTimeRemaining: (): number => {
    const data = getRateLimitData();
    if (!data.blocked) return 0;
    
    const elapsed = Date.now() - data.timestamp;
    const remaining = Math.max(0, COOLDOWN_TIME - elapsed);
    return Math.ceil(remaining / 1000); // Convertir en secondes
  },

  /**
   * Obtient le nombre de tentatives actuelles
   */
  getAttempts: (): number => {
    const data = getRateLimitData();
    return data.attempts;
  }
};

// Fonctions utilitaires privées
function getRateLimitData(): RateLimitData {
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  if (!stored) {
    return { attempts: 0, timestamp: Date.now(), blocked: false };
  }
  return JSON.parse(stored);
}

function saveRateLimitData(data: RateLimitData): void {
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
}

function resetRateLimit(): void {
  localStorage.setItem(
    RATE_LIMIT_KEY,
    JSON.stringify({ attempts: 0, timestamp: Date.now(), blocked: false })
  );
}
