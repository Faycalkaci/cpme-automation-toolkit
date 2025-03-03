
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Shield, Database, FileText } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Database className="h-6 w-6 text-primary" />,
      title: 'Importation de données',
      description: 'Importez vos données depuis Excel ou CSV en quelques clics.'
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: 'Génération de PDF',
      description: 'Générez automatiquement des PDF à partir de vos données.'
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: 'Sécurité avancée',
      description: 'Protection des données et conformité RGPD garanties.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Hero Section */}
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
              <Button 
                size="lg" 
                className="shadow-lg group"
                onClick={() => navigate('/register')}
              >
                Commencer maintenant 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/login')}
              >
                Se connecter
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Simplifiez votre gestion documentaire</h2>
            <p className="mt-4 text-lg text-slate-600">
              Nos fonctionnalités sont conçues pour vous faire gagner du temps et améliorer votre efficacité.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-8 rounded-lg shadow-soft border border-slate-100 transition-all hover:shadow-premium hover:border-slate-200"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Comment ça fonctionne</h2>
            <p className="mt-4 text-lg text-slate-600">
              Un processus simple en trois étapes pour automatiser vos documents
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="relative"
          >
            <div className="absolute top-24 left-0 right-0 h-0.5 bg-slate-200 hidden md:block"></div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Importez vos données',
                  description: 'Téléchargez vos fichiers Excel ou CSV contenant les informations de vos adhérents.',
                  step: '1'
                },
                {
                  title: 'Sélectionnez un modèle',
                  description: 'Choisissez le modèle de document que vous souhaitez générer (appel de cotisation, facture, etc.).',
                  step: '2'
                },
                {
                  title: 'Générez et envoyez',
                  description: 'Générez automatiquement vos documents et envoyez-les par email en un clic.',
                  step: '3'
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative"
                >
                  <div className="bg-white p-8 rounded-lg shadow-soft border border-slate-100 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-cpme flex items-center justify-center text-white font-medium mb-6 absolute -top-5 left-8 shadow-lg">
                      {step.step}
                    </div>
                    <div className="pt-4">
                      <h3 className="text-xl font-medium text-slate-900 mb-3">{step.title}</h3>
                      <p className="text-slate-600">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
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
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate('/contact')}
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
    </div>
  );
};

export default Index;
