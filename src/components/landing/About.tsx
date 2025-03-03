
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Phone, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';

const About = () => {
  const navigate = useNavigate();
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);

  return (
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
                    <p><span className="bg-primary/10 text-primary text-xs px-1 rounded">{'{{SOCIETE}}'}</span></p>
                    <p>Représenté par: <span className="bg-primary/10 text-primary text-xs px-1 rounded">{'{{Dirigeant}}'}</span></p>
                    <p><span className="bg-primary/10 text-primary text-xs px-1 rounded">{'{{Adresse}}'}</span>, <span className="bg-primary/10 text-primary text-xs px-1 rounded">{'{{ville}}'}</span></p>
                  </div>
                  
                  <div>
                    <p className="font-medium">Numéro d'adhérent: <span className="bg-primary/10 text-primary text-xs px-1 rounded">{'{{N° adh}}'}</span></p>
                    <p>Cotisation: <span className="bg-primary/10 text-primary text-xs px-1 rounded">{'{{Cotisation}}'}</span> €</p>
                    <p>Date d'échéance: <span className="bg-primary/10 text-primary text-xs px-1 rounded">{'{{DATE ECHEANCE}}'}</span></p>
                  </div>
                  
                  <div>
                    <p className="font-medium">Contact:</p>
                    <p><span className="bg-primary/10 text-primary text-xs px-1 rounded">{'{{E MAIL 1}}'}</span></p>
                    <p><span className="bg-primary/10 text-primary text-xs px-1 rounded">{'{{E Mail 2}}'}</span></p>
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
    </section>
  );
};

export default About;
