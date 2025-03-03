
import React from 'react';
import { motion } from 'framer-motion';
import { Database, FileText, Mail, Shield } from 'lucide-react';

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
    icon: <Mail className="h-6 w-6 text-primary" />,
    title: 'Envoi par email',
    description: 'Envoyez directement les documents générés par email à vos adhérents.'
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
  return (
    <section id="features" className="py-20 bg-slate-50">
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
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
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
  );
};

export default Features;
