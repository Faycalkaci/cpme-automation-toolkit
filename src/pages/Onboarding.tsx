
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Check, Play, Database, Mail, ArrowRight } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const [videoPlaying, setVideoPlaying] = useState(false);
  
  // Les étapes principales
  const steps = [
    {
      title: "Importer vos données",
      description: "Importez facilement vos fichiers Excel ou CSV contenant les informations de vos adhérents.",
      icon: <Database className="h-8 w-8 text-blue-500" />,
      imageSrc: "https://via.placeholder.com/500x280?text=Import+de+données"
    },
    {
      title: "Générer des documents",
      description: "Sélectionnez vos adhérents et générez automatiquement les documents PDF dont vous avez besoin.",
      icon: <FileText className="h-8 w-8 text-green-500" />,
      imageSrc: "https://via.placeholder.com/500x280?text=Génération+de+documents"
    },
    {
      title: "Envoyer par email",
      description: "Envoyez directement les documents générés par email à vos adhérents, en quelques clics.",
      icon: <Mail className="h-8 w-8 text-purple-500" />,
      imageSrc: "https://via.placeholder.com/500x280?text=Envoi+par+email"
    }
  ];
  
  // Animation des étapes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  // Simuler la lecture de la vidéo
  const handlePlayVideo = () => {
    setVideoPlaying(true);
    // Dans un cas réel, cela lancerait la vidéo
  };
  
  // Continuer vers le tableau de bord
  const handleContinue = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* En-tête */}
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="https://via.placeholder.com/40?text=CPME" 
              alt="CPME Tool" 
              className="h-10 w-10"
            />
            <h1 className="ml-2 text-xl font-bold text-slate-900">CPME Tool</h1>
          </div>
          <Button onClick={handleContinue}>
            Aller au tableau de bord
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Section vidéo */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Bienvenue sur CPME Tool</h2>
            <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
              Découvrez comment automatiser la génération de vos documents et simplifier votre workflow quotidien.
            </p>
          </div>
          
          <Card className="overflow-hidden">
            <div className="aspect-video bg-slate-100 relative">
              {!videoPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button 
                    size="lg" 
                    className="rounded-full w-16 h-16 flex items-center justify-center"
                    onClick={handlePlayVideo}
                  >
                    <Play className="h-8 w-8" />
                  </Button>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-sm">
                    <div className="text-center">
                      <p className="text-xl font-medium mb-2">Vidéo explicative</p>
                      <p className="text-sm text-slate-600">Durée: 0:48</p>
                    </div>
                  </div>
                </div>
              ) : (
                <iframe 
                  className="w-full h-full" 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                  title="CPME Tool Presentation" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              )}
            </div>
            <CardFooter className="py-4 flex justify-between items-center">
              <p className="text-sm text-slate-500">
                Cette vidéo présente les principales fonctionnalités de CPME Tool.
              </p>
              <Button variant="outline" size="sm" onClick={handlePlayVideo}>
                {videoPlaying ? "Revoir la vidéo" : "Regarder la vidéo"}
              </Button>
            </CardFooter>
          </Card>
        </section>
        
        {/* Section étapes */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Comment ça fonctionne
          </h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {steps.map((step, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-50 mr-3">
                        {step.icon}
                      </div>
                      <CardTitle>{step.title}</CardTitle>
                    </div>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="rounded-md overflow-hidden">
                      <img 
                        src={step.imageSrc} 
                        alt={step.title} 
                        className="w-full h-auto"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <ul className="space-y-2 w-full">
                      <li className="flex items-center text-sm text-slate-600">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Simple et rapide
                      </li>
                      <li className="flex items-center text-sm text-slate-600">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Automatisé de bout en bout
                      </li>
                    </ul>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>
        
        {/* Section CTA */}
        <section className="text-center mb-16">
          <Card className="bg-gradient-to-r from-primary/90 to-primary text-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Prêt à commencer ?</CardTitle>
              <CardDescription className="text-white/90">
                Passez moins de temps sur les tâches administratives et plus de temps sur ce qui compte vraiment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                CPME Tool est conçu spécifiquement pour les CPME et s'adapte parfaitement à votre workflow actuel.
              </p>
              <Button 
                size="lg" 
                variant="secondary" 
                onClick={handleContinue}
                className="font-medium"
              >
                Accéder à mon tableau de bord
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Onboarding;
