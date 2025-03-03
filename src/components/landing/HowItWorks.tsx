
import React from 'react';
import { motion } from 'framer-motion';

const steps = [
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

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
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
            {steps.map((step, index) => (
              <motion.div key={index} variants={itemVariants} className="relative">
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
  );
};

export default HowItWorks;
