
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { stripeService, PLANS } from '@/services/stripe/stripeService';
import { toast } from 'sonner';

const Billing = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  // Fonction pour rediriger vers la page de paiement Stripe
  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour vous abonner');
      return;
    }
    
    setIsLoading(true);
    try {
      // Créer une session de paiement Stripe
      const sessionId = await stripeService.createCheckoutSession(
        PLANS[planId as keyof typeof PLANS].id,
        user.id // Utiliser l'ID utilisateur comme ID client
      );
      
      // Rediriger vers la page de paiement Stripe
      await stripeService.redirectToCheckout(sessionId);
    } catch (error) {
      console.error('Erreur lors de la création de la session de paiement:', error);
      toast.error('Impossible de créer la session de paiement');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center">
        <CreditCard className="h-8 w-8 mr-3 text-green-500" />
        Facturation
      </h1>
      <p className="text-slate-600 mb-6">
        Gérez vos abonnements et vos factures
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(PLANS).map(([planId, plan]) => (
          <Card key={planId} className={`border-2 ${selectedPlan === planId ? 'border-primary' : 'border-slate-200'}`}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {plan.name}
                <span className="text-2xl font-bold">{plan.price}€</span>
              </CardTitle>
              <CardDescription>/utilisateur/mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleSubscribe(planId)}
                disabled={isLoading}
                variant={selectedPlan === planId ? 'default' : 'outline'}
                onMouseEnter={() => setSelectedPlan(planId)}
                onMouseLeave={() => setSelectedPlan(null)}
              >
                Choisir ce plan {selectedPlan === planId && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
          <CardDescription>
            Consultez vos factures et l'historique de vos paiements
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-64 flex items-center justify-center border rounded-lg">
            <p className="text-slate-500">Les informations de facturation seront disponibles après votre premier abonnement.</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Billing;
