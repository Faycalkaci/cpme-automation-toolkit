import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CheckCircle, ArrowRight, Shield, Database, FileText, Mail, Users, Star, MessageCircle, FileSpreadsheet, Phone, Calendar } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);

  // Pricing constants
  const DISCOUNT_PERCENTAGE = 20;
  const prices = {
    standard: {
      monthly: 49,
      annual: 49 * 12 * (1 - DISCOUNT_PERCENTAGE / 100)
    },
    pro: {
      monthly: 99,
      annual: 99 * 12 * (1 - DISCOUNT_PERCENTAGE / 100)
    },
    enterprise: {
      monthly: 199,
      annual: 199 * 12 * (1 - DISCOUNT_PERCENTAGE / 100)
    }
  };
  const features = [{
    icon: <Database className="h-6 w-6 text-primary" />,
    title: 'Importation de données',
    description: 'Importez vos données depuis Excel ou CSV en quelques clics.'
  }, {
    icon: <FileText className="h-6 w-6 text-primary" />,
    title: 'Génération de PDF',
    description: 'Générez automatiquement des PDF à partir de vos données.'
  }, {
    icon: <Mail className="h-6 w-6 text-primary" />,
    title: 'Envoi par email',
    description: 'Envoyez directement les documents générés par email à vos adhérents.'
  }, {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: 'Sécurité avancée',
    description: 'Protection des données et conformité RGPD garanties.'
  }];
  const testimonials = [{
    name: "Marie-Claire Durand",
    role: "Assistante Administrative, CPME 93",
    content: "Avant CPME Tool, je passais des heures à copier-coller des données. Maintenant, je génère tous mes documents en quelques clics !",
    rating: 5
  }, {
    name: "Valérie Martin",
    role: "Présidente, CPME Seine-Saint-Denis",
    content: "Une solution adaptée à nos besoins qui a considérablement amélioré notre productivité. Notre équipe gagne un temps précieux.",
    rating: 5
  }, {
    name: "Philippe Dubois",
    role: "Directeur, CPME Loire",
    content: "L'interface est intuitive et la génération de documents fonctionne parfaitement. Le support client est également très réactif.",
    rating: 4
  }];
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
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

  // Format price with euro symbol
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };
  return <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              
              <span className="tracking-tight my-0 py-0 text-2xl font-bold mx-[5px] px-[23px] text-[#0069da]">CPME Tool</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-slate-700 hover:text-cpme transition-colors">
                Fonctionnalités
              </a>
              <a href="#pricing" className="text-sm font-medium text-slate-700 hover:text-cpme transition-colors">
                Tarifs
              </a>
              <a href="#about" className="text-sm font-medium text-slate-700 hover:text-cpme transition-colors">
                À propos
              </a>
            </nav>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Se connecter
              </Button>
              <Button onClick={() => navigate('/register')}>
                S'inscrire
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 z-0"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="text-center">
            <motion.h1 initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.2,
            duration: 0.6
          }} className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
              <span className="text-cpme">CPME Tool</span> - Automatisez vos documents de facturation
            </motion.h1>
            <motion.p initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.4,
            duration: 0.6
          }} className="text-xl text-slate-600 max-w-3xl mx-auto">
              Transformez vos données Excel en documents PDF personnalisés et automatisez vos processus de facturation en quelques clics.
            </motion.p>
            <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.6,
            duration: 0.6
          }} className="mt-10 flex flex-wrap justify-center gap-4">
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

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Simplifiez votre gestion documentaire</h2>
            <p className="mt-4 text-lg text-slate-600">
              Nos fonctionnalités sont conçues pour vous faire gagner du temps et améliorer votre efficacité.
            </p>
          </div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
          once: true,
          amount: 0.1
        }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => <motion.div key={index} variants={itemVariants} className="bg-white p-8 rounded-lg shadow-soft border border-slate-100 transition-all hover:shadow-premium hover:border-slate-200">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>)}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Comment ça fonctionne</h2>
            <p className="mt-4 text-lg text-slate-600">
              Un processus simple en trois étapes pour automatiser vos documents
            </p>
          </div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
          once: true,
          amount: 0.1
        }} className="relative">
            <div className="absolute top-24 left-0 right-0 h-0.5 bg-slate-200 hidden md:block"></div>
            <div className="grid md:grid-cols-3 gap-8">
              {[{
              title: 'Importez vos données',
              description: 'Téléchargez vos fichiers Excel ou CSV contenant les informations de vos adhérents.',
              step: '1'
            }, {
              title: 'Sélectionnez un modèle',
              description: 'Choisissez le modèle de document que vous souhaitez générer (appel de cotisation, facture, etc.).',
              step: '2'
            }, {
              title: 'Générez et envoyez',
              description: 'Générez automatiquement vos documents et envoyez-les par email en un clic.',
              step: '3'
            }].map((step, index) => <motion.div key={index} variants={itemVariants} className="relative">
                  <div className="bg-white p-8 rounded-lg shadow-soft border border-slate-100 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-cpme flex items-center justify-center text-white font-medium mb-6 absolute -top-5 left-8 shadow-lg">
                      {step.step}
                    </div>
                    <div className="pt-4">
                      <h3 className="text-xl font-medium text-slate-900 mb-3">{step.title}</h3>
                      <p className="text-slate-600">{step.description}</p>
                    </div>
                  </div>
                </motion.div>)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section with Template Example */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">À propos de CPME Tool</h2>
            <p className="mt-4 text-lg text-slate-600">
              Une solution développée spécifiquement pour les besoins des CPME
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Notre mission</h3>
              <p className="text-slate-600 mb-6">
                Développée en collaboration avec plusieurs CPME territoriales, notre solution répond aux besoins spécifiques 
                de gestion documentaire des organisations professionnelles. Notre mission est de simplifier vos tâches administratives 
                quotidiennes pour vous permettre de vous concentrer sur l'essentiel : l'accompagnement de vos adhérents.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-cpme mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-700">Solution conçue spécifiquement pour les CPME territoriales</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-cpme mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-700">Développement continu en fonction de vos retours</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-cpme mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-700">Support dédié pour vous accompagner</p>
                </div>
              </div>
              
              <Button 
                className="mt-8" 
                variant="outline"
                onClick={() => setShowTemplateDialog(true)}
              >
                Voir un exemple de modèle
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-slate-50 p-8 rounded-xl shadow-soft"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-cpme-dark rounded-full flex items-center justify-center mr-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">Notre histoire</h4>
                  <p className="text-slate-600">Depuis 2022</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="border-l-2 border-cpme pl-4 py-2">
                  <p className="text-sm text-slate-500">2022</p>
                  <p className="font-medium">Lancement du développement</p>
                </div>
                
                <div className="border-l-2 border-cpme pl-4 py-2">
                  <p className="text-sm text-slate-500">2023</p>
                  <p className="font-medium">Déploiement auprès des premières CPME</p>
                </div>
                
                <div className="border-l-2 border-cpme pl-4 py-2">
                  <p className="text-sm text-slate-500">2024</p>
                  <p className="font-medium">Extension des fonctionnalités et croissance</p>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <Button onClick={() => navigate('/contact')}>
                  <Phone className="mr-2 h-4 w-4" />
                  Nous contacter
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Template Example Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Exemple de modèle: Appel de cotisation</DialogTitle>
            <DialogDescription>
              Voici un exemple de modèle d'appel de cotisation avec les champs mappés.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Champs de votre fichier Excel</h3>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center mb-3">
                  <FileSpreadsheet className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium">Données d'adhérents.xlsx</span>
                </div>
                
                <div className="space-y-2">
                  {['DATE ECHEANCE', 'Cotisation', 'N° adh', 'SOCIETE', 'Dirigeant', 'E MAIL 1', 'E Mail 2', 'Adresse', 'ville'].map((field, index) => (
                    <div key={index} className="bg-white p-2 text-sm rounded border border-slate-100 flex items-center">
                      <span className="font-medium">{field}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Rendu dans le PDF généré</h3>
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4 pb-2 border-b">
                  <div className="font-bold text-lg">CPME Territorial</div>
                  <div className="text-sm">Appel de cotisation</div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Adhérent:</p>
                    <p><span className="bg-primary/10 text-primary text-xs px-1 rounded">{{SOCIETE}}</span></p>
                    <p>Représenté par: <span className="bg-primary/10 text-primary text-xs px-1 rounded">{{Dirigeant}}</span></p>
                    <p><span className="bg-primary/10 text-primary text-xs px-1 rounded">{{Adresse}}</span>, <span className="bg-primary/10 text-primary text-xs px-1 rounded">{{ville}}</span></p>
                  </div>
                  
                  <div>
                    <p className="font-medium">Numéro d'adhérent: <span className="bg-primary/10 text-primary text-xs px-1 rounded">{{N° adh}}</span></p>
                    <p>Cotisation: <span className="bg-primary/10 text-primary text-xs px-1 rounded">{{Cotisation}}</span> €</p>
                    <p>Date d'échéance: <span className="bg-primary/10 text-primary text-xs px-1 rounded">{{DATE ECHEANCE}}</span></p>
                  </div>
                  
                  <div>
                    <p className="font-medium">Contact:</p>
                    <p><span className="bg-primary/10 text-primary text-xs px-1 rounded">{{E MAIL 1}}</span></p>
                    <p><span className="bg-primary/10 text-primary text-xs px-1 rounded">{{E Mail 2}}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-slate-600 mb-4">
              CPME Tool vous permet de générer automatiquement des documents comme celui-ci pour tous vos adhérents en quelques clics.
            </p>
            <Button onClick={() => {
              setShowTemplateDialog(false);
              navigate('/register');
            }}>
              Essayer CPME Tool
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Ce que nos utilisateurs disent</h2>
            <p className="mt-4 text-lg text-slate-600">
              Découvrez l'expérience de nos utilisateurs avec CPME Tool
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1,
            duration: 0.5
          }} className="bg-white p-8 rounded-lg shadow-soft border border-slate-100">
                <div className="flex mb-4">
                  {Array.from({
                length: 5
              }).map((_, i) => <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />)}
                </div>
                <p className="text-slate-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-cpme/10 flex items-center justify-center mr-3">
                    <MessageCircle className="h-5 w-5 text-cpme" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Des licences adaptées à vos besoins</h2>
            <p className="mt-4 text-lg text-slate-600">
              Choisissez le forfait qui correspond à la taille de votre CPME
            </p>
            
            <div className="flex justify-center mt-8">
              <div className="bg-slate-100 p-1 rounded-full inline-flex">
                <button className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`} onClick={() => setBillingCycle('monthly')}>
                  Mensuel
                </button>
                <button className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'annual' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`} onClick={() => setBillingCycle('annual')}>
                  Annuel <span className="text-xs text-green-600 font-bold">-20%</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[{
            title: "Licence Standard",
            price: billingCycle === 'monthly' ? prices.standard.monthly : prices.standard.annual / 12,
            period: billingCycle === 'monthly' ? "par mois" : "par mois, facturé annuellement",
            features: ["Jusqu'à 3 utilisateurs", "500 documents par mois", "Modèles prédéfinis", "Support par email"]
          }, {
            title: "Licence Pro",
            price: billingCycle === 'monthly' ? prices.pro.monthly : prices.pro.annual / 12,
            period: billingCycle === 'monthly' ? "par mois" : "par mois, facturé annuellement",
            popular: true,
            features: ["Jusqu'à 10 utilisateurs", "Documents illimités", "Modèles personnalisables", "Support prioritaire"]
          }, {
            title: "Licence Enterprise",
            price: billingCycle === 'monthly' ? prices.enterprise.monthly : prices.enterprise.annual / 12,
            period: billingCycle === 'monthly' ? "par mois" : "par mois, facturé annuellement",
            features: ["Utilisateurs illimités", "Documents illimités", "Modèles 100% personnalisés", "Support dédié 24/7"]
          }].map((plan, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1,
            duration: 0.5
          }} className={`bg-white rounded-lg shadow-soft border ${plan.popular ? 'border-primary ring-2 ring-primary/20' : 'border-slate-100'} overflow-hidden`}>
                {plan.popular && <div className="bg-primary text-white text-center py-1.5 text-sm font-medium">
                    Recommandé
                  </div>}
                <div className="p-8">
                  <h3 className="text-xl font-bold text-slate-900">{plan.title}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold text-slate-900">{formatPrice(plan.price)}</span>
                    <span className="ml-1 text-slate-500">{plan.period}</span>
                  </div>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, i) => <li key={i} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-cpme mr-2 flex-shrink-0" />
                        <span className="text-slate-600">{feature}</span>
                      </li>)}
                  </ul>
                  <Button className="w-full mt-8" variant={plan.popular ? "default" : "outline"}>
                    Sélectionner
                  </Button>
                </div>
              </motion.div>)}
          </div>
          
          {billingCycle === 'annual' && <div className="text-center mt-8 text-sm text-slate-500">
              * La facturation annuelle vous permet d'économiser 20% par rapport au tarif mensuel.
            </div>}
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
            <Button size="lg" variant="secondary" className="bg-white text-cpme-dark hover:bg-white/90 shadow-lg" onClick={() => navigate('/register')}>
              Commencer gratuitement
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/contact')} className="border-white bg-slate-50 text-black">
              Nous contacter
            </Button>
          </div>

          <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8">
            {['Sécurité garantie', 'Support réactif', 'Mise en route rapide'].map((item, i) => <div key={i} className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-white" />
                <span>{item}</span>
              </div>)}
          </div>
        </div>
      </section>
    </div>;
};

export default Index;
