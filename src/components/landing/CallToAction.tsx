
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-r from-cpme-dark to-cpme text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Prêt à simplifier votre gestion documentaire ?</h2>
        <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto">
          Rejoignez les CPME qui ont déjà adopté notre solution pour optimiser leurs processus administratifs.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            size="lg" 
            variant="secondary" 
            className="bg-white text-cpme-dark hover:bg-white/90 shadow-lg" 
            onClick={() => navigate('/register')}
          >
            Commencer gratuitement
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => navigate('/contact')} 
            className="border-white bg-slate-50 text-black"
          >
            Nous contacter
          </Button>
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8">
          {['Sécurité garantie', 'Support réactif', 'Mise en route rapide'].map((item, i) => (
            <div key={i} className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-white" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
