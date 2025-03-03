
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SocialLogin } from '@/components/auth/SocialLogin';

const Login = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-lg shadow-soft border border-slate-100 p-8 w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center text-sm text-slate-600 hover:text-primary mb-4">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Retour à l'accueil
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Connexion à CPME Tool</h1>
            <p className="text-slate-600 mt-2">Entrez vos identifiants pour accéder à votre compte</p>
          </div>

          <LoginForm />
          
          <SocialLogin />

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Vous n'avez pas de compte ?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Créer un compte
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
