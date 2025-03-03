
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 z-0"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="text-center"
        >
          <motion.h1 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2, duration: 0.6 }} 
            className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6"
          >
            <span className="text-cpme">CPME Tool</span> - Automatisez vos documents de facturation
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.4, duration: 0.6 }} 
            className="text-xl text-slate-600 max-w-3xl mx-auto"
          >
            Transformez vos données Excel en documents PDF personnalisés et automatisez vos processus de facturation en quelques clics.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.6, duration: 0.6 }} 
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Button size="lg" className="shadow-lg group" onClick={() => navigate('/register')}>
              Commencer maintenant 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
              Se connecter
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
