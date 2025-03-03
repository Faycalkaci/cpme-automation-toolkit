
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Pricing constants
const DISCOUNT_PERCENTAGE = 20;
const prices = {
  standard: {
    monthly: 49,
    annual: 49 * 12 * (1 - DISCOUNT_PERCENTAGE / 100)
  },
  pro: {
    monthly: 99,
    annual: 99 * 12 * (1 - DISCOUNT_PERCENTAGE / 100)
  },
  enterprise: {
    monthly: 199,
    annual: 199 * 12 * (1 - DISCOUNT_PERCENTAGE / 100)
  }
};

// Format price with euro symbol
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Des licences adaptées à vos besoins</h2>
          <p className="mt-4 text-lg text-slate-600">
            Choisissez le forfait qui correspond à la taille de votre CPME
          </p>
          
          <div className="flex justify-center mt-8">
            <div className="bg-slate-100 p-1 rounded-full inline-flex">
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`} 
                onClick={() => setBillingCycle('monthly')}
              >
                Mensuel
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'annual' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`} 
                onClick={() => setBillingCycle('annual')}
              >
                Annuel <span className="text-xs text-green-600 font-bold">-20%</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Licence Standard",
              price: billingCycle === 'monthly' ? prices.standard.monthly : prices.standard.annual / 12,
              period: billingCycle === 'monthly' ? "par mois" : "par mois, facturé annuellement",
              features: ["Jusqu'à 3 utilisateurs", "500 documents par mois", "Modèles prédéfinis", "Support par email"]
            }, 
            {
              title: "Licence Pro",
              price: billingCycle === 'monthly' ? prices.pro.monthly : prices.pro.annual / 12,
              period: billingCycle === 'monthly' ? "par mois" : "par mois, facturé annuellement",
              popular: true,
              features: ["Jusqu'à 10 utilisateurs", "Documents illimités", "Modèles personnalisables", "Support prioritaire"]
            }, 
            {
              title: "Licence Enterprise",
              price: billingCycle === 'monthly' ? prices.enterprise.monthly : prices.enterprise.annual / 12,
              period: billingCycle === 'monthly' ? "par mois" : "par mois, facturé annuellement",
              features: ["Utilisateurs illimités", "Documents illimités", "Modèles 100% personnalisés", "Support dédié 24/7"]
            }
          ].map((plan, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: index * 0.1, duration: 0.5 }} 
              className={`bg-white rounded-lg shadow-soft border ${plan.popular ? 'border-primary ring-2 ring-primary/20' : 'border-slate-100'} overflow-hidden`}
            >
              {plan.popular && (
                <div className="bg-primary text-white text-center py-1.5 text-sm font-medium">
                  Recommandé
                </div>
              )}
              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-900">{plan.title}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold text-slate-900">{formatPrice(plan.price)}</span>
                  <span className="ml-1 text-slate-500">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-cpme mr-2 flex-shrink-0" />
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-8" variant={plan.popular ? "default" : "outline"}>
                  Sélectionner
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {billingCycle === 'annual' && (
          <div className="text-center mt-8 text-sm text-slate-500">
            * La facturation annuelle vous permet d'économiser 20% par rapport au tarif mensuel.
          </div>
        )}
      </div>
    </section>
  );
};

export default Pricing;
