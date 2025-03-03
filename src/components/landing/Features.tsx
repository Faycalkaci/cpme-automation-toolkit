
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Users, BarChart, Shield, ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: <Database className="h-6 w-6 text-primary" />,
    title: 'Importation facilitée',
    description: 'Intégrez en quelques clics vos données existantes'
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: 'Gestion intuitive',
    description: 'Interface simplifiée pour gérer efficacement vos adhérents'
  },
  {
    icon: <BarChart className="h-6 w-6 text-primary" />,
    title: 'Suivi en temps réel',
    description: 'Tableaux de bord et rapports pour suivre votre activité'
  },
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: 'Sécurité renforcée',
    description: 'Protection des données sensibles avec chiffrement AES-256'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12
    }
  }
};

const Features = () => {
  const navigate = useNavigate();
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const handleStartFree = () => {
    navigate('/register');
  };

  const handleViewDemo = () => {
    // For now, just scroll to the section that would contain a demo
    const demoSection = document.getElementById('how-it-works');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
    // Alternative: Open a modal with a demo video
    // setDemoModalOpen(true);
  };

  return (
    <section id="features" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 leading-tight">
                Dites adieu aux tâches administratives répétitives
              </h2>
              <p className="mt-6 text-lg text-slate-600">
                Notre solution vous permet de vous concentrer sur ce qui est vraiment important : 
                développer votre réseau et accompagner vos adhérents.
              </p>
            </div>

            <motion.div 
              variants={containerVariants} 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, amount: 0.1 }} 
              className="space-y-6"
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants} 
                  className="flex items-start gap-4"
                >
                  <div className="mt-1 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-900">{feature.title}</h3>
                    <p className="text-slate-600 mt-1">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                onClick={handleStartFree} 
                className="bg-primary text-white px-6 py-3 rounded-md shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                Démarrer gratuitement
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={handleViewDemo} 
                className="border-slate-300 text-slate-700 px-6 py-3 rounded-md shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Play className="h-4 w-4 text-primary" />
                Voir la démonstration
              </Button>
            </div>
          </div>

          {/* Right Column - Illustration */}
          <div className="relative">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden p-4 md:p-6 border border-slate-100">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-slate-900">Génération de documents</h3>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm text-slate-600 mb-3">Sélectionnez un modèle</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border border-primary/30 rounded-md p-3 bg-blue-50/50">
                    <div className="w-12 h-12 bg-blue-100 rounded-md mb-2 mx-auto"></div>
                    <p className="text-xs text-center font-medium">Appel de cotisation</p>
                  </div>
                  <div className="border border-slate-200 rounded-md p-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-md mb-2 mx-auto"></div>
                    <p className="text-xs text-center">Rappel</p>
                  </div>
                  <div className="border border-slate-200 rounded-md p-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-md mb-2 mx-auto"></div>
                    <p className="text-xs text-center">Facture</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm text-slate-600 mb-3">Adhérents sélectionnés</h4>
                <div className="space-y-2 border border-slate-100 rounded-md p-3">
                  {['Martin Dupont', 'Sophie Laurent', 'Thomas Lefebvre'].map((name, i) => (
                    <div key={i} className="flex justify-between items-center py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100"></div>
                        <span className="text-sm">{name}</span>
                      </div>
                      <span className="text-xs text-slate-500">ID #{(1234 + i * 4444).toString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-slate-600">Options d'envoi</div>
                <Button className="bg-primary text-white">
                  Générer les documents
                </Button>
              </div>
              
              {/* Success notification */}
              <div className="absolute top-4 right-4 bg-white shadow-lg rounded-md border border-green-100 p-3 max-w-xs">
                <div className="text-sm font-medium text-slate-900">Génération terminée</div>
                <div className="text-xs text-green-600">3 documents créés avec succès</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
