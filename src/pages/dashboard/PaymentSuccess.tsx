
import React, { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import { firestoreService } from '@/services/firebase/firestore';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const { user, isLoading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const updatePaymentStatus = async () => {
      if (!user || !user.id) return;
      
      try {
        // Update the user's payment status in Firestore
        await firestoreService.users.update(user.id, {
          hasPaid: true
        });
        
        // Log the payment success
        await firestoreService.automationLogs.add({
          type: 'payment_success',
          details: { sessionId, plan: 'standard' },
          status: 'success',
          userId: user.id
        });
        
        toast.success("Paiement réussi ! Vous avez maintenant accès à toutes les fonctionnalités.");
        
        // Set a small delay before redirecting
        setTimeout(() => {
          setIsRedirecting(true);
        }, 2000);
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut de paiement:', error);
        toast.error("Une erreur est survenue lors de la mise à jour de votre compte.");
      } finally {
        setIsUpdating(false);
      }
    };

    if (user && !isLoading) {
      updatePaymentStatus();
    }
  }, [user, isLoading, sessionId]);

  // For non-authenticated users, show payment success but with a login button
  if (!isLoading && !user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[70vh] p-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-6">Paiement confirmé</h1>
          <p className="text-lg text-slate-600 mb-6">
            Votre paiement a été traité avec succès. Veuillez vous connecter pour accéder à toutes les fonctionnalités.
          </p>
          <a href="/login" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors">
            Se connecter
          </a>
        </div>
      </motion.div>
    );
  }

  // Redirect to form page after updating
  if (isRedirecting) {
    return <Navigate to="/forms" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[70vh] p-6"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-6">Paiement confirmé</h1>
        
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" className="text-primary" />
          <p className="text-lg text-slate-600">
            {isUpdating ? "Mise à jour de votre compte..." : "Redirection en cours..."}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentSuccess;
