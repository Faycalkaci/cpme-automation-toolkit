
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

const Billing = () => {
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

      <Card>
        <CardHeader>
          <CardTitle>Abonnements</CardTitle>
          <CardDescription>
            Détails de votre abonnement actuel
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-96 flex items-center justify-center border rounded-lg">
            <p className="text-slate-500">Les informations de facturation seront disponibles prochainement.</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Billing;
