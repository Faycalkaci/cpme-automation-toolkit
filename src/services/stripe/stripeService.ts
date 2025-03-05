
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Clé publique Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'YOUR_STRIPE_PUBLIC_KEY');

// Informations de tarification
export const PLANS = {
  standard: {
    name: 'Standard',
    id: import.meta.env.VITE_STRIPE_STANDARD_PLAN_ID || 'price_standard',
    price: 9.99,
    users: 1,
    features: ['Fonctionnalités de base', 'Support email']
  },
  pro: {
    name: 'Pro',
    id: import.meta.env.VITE_STRIPE_PRO_PLAN_ID || 'price_pro',
    price: 19.99,
    users: 1,
    features: ['Toutes les fonctionnalités standard', 'Accès prioritaire au support', 'Fonctionnalités avancées']
  },
  enterprise: {
    name: 'Enterprise',
    id: import.meta.env.VITE_STRIPE_ENTERPRISE_PLAN_ID || 'price_enterprise',
    price: 49.99,
    users: 3,
    features: ['Toutes les fonctionnalités pro', 'Support dédié', 'Utilisateurs multiples']
  }
};

// URL du backend pour les requêtes Stripe (à déployer sur Hostinger)
const API_URL = import.meta.env.VITE_API_URL || 'https://votre-api.hostinger.fr';

export const stripeService = {
  // Obtenir l'instance Stripe
  getStripe: async (): Promise<Stripe | null> => {
    return await stripePromise;
  },
  
  // Créer une session de paiement
  createCheckoutSession: async (
    planId: string, 
    customerId?: string, 
    successUrl: string = `${window.location.origin}/billing/success`,
    cancelUrl: string = `${window.location.origin}/billing/cancel`
  ): Promise<string> => {
    try {
      const response = await fetch(`${API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: planId,
          customerId,
          successUrl,
          cancelUrl,
        }),
      });

      const session = await response.json();
      
      if (session.error) {
        throw new Error(session.error);
      }
      
      return session.id;
    } catch (error) {
      console.error('Erreur lors de la création de la session de paiement:', error);
      throw error;
    }
  },
  
  // Rediriger vers la page de paiement Stripe
  redirectToCheckout: async (sessionId: string): Promise<void> => {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe n\'a pas pu être initialisé');
      }
      
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Erreur lors de la redirection vers la page de paiement:', error);
      throw error;
    }
  },
  
  // Obtenir les détails d'un abonnement
  getSubscription: async (subscriptionId: string): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/subscriptions/${subscriptionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de l\'abonnement:', error);
      throw error;
    }
  },
  
  // Annuler un abonnement
  cancelSubscription: async (subscriptionId: string): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'annulation de l\'abonnement:', error);
      throw error;
    }
  },
  
  // Mettre à jour un abonnement
  updateSubscription: async (subscriptionId: string, newPlanId: string): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: newPlanId,
        }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'abonnement:', error);
      throw error;
    }
  },
  
  // Créer un portail client pour la gestion de l'abonnement
  createCustomerPortalSession: async (
    customerId: string,
    returnUrl: string = `${window.location.origin}/billing`
  ): Promise<string> => {
    try {
      const response = await fetch(`${API_URL}/create-customer-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl,
        }),
      });
      
      const session = await response.json();
      
      if (session.error) {
        throw new Error(session.error);
      }
      
      return session.url;
    } catch (error) {
      console.error('Erreur lors de la création de la session du portail client:', error);
      throw error;
    }
  },
  
  // Configuration des webhooks Stripe
  configureWebhooks: async (): Promise<boolean> => {
    try {
      // Note: This is a placeholder for webhook configuration
      // In a real implementation, this would communicate with your backend
      console.log('Setting up Stripe webhooks configuration');
      
      // Log the webhook endpoints that should be configured in the Stripe dashboard
      console.log('Webhook endpoints should be configured for:');
      console.log('- customer.subscription.created');
      console.log('- customer.subscription.updated');
      console.log('- customer.subscription.deleted');
      console.log('- invoice.payment_succeeded');
      console.log('- invoice.payment_failed');
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la configuration des webhooks Stripe:', error);
      return false;
    }
  }
};
