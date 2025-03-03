
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileUp, TableProperties, FileCheck, Mail, Check, Clipboard, FileSpreadsheet, FileText, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const TutorialGuide = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Vérifier si c'est la première visite
    const hasSeenTutorial = localStorage.getItem('cpme-tutorial-completed');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const steps: TutorialStep[] = [
    {
      title: "Bienvenue sur CPME Tool",
      description: "Découvrez comment utiliser notre outil pour automatiser la génération de documents pour vos adhérents.",
      icon: <Check className="h-12 w-12 text-cpme" />
    },
    {
      title: "Importez vos données",
      description: "Commencez par importer votre fichier Excel ou CSV contenant les informations de vos adhérents dans la section Spreadsheets.",
      icon: <FileUp className="h-12 w-12 text-blue-500" />
    },
    {
      title: "Visualisez et filtrez vos données",
      description: "Après l'importation, vous pouvez visualiser, rechercher et filtrer facilement les informations de vos adhérents.",
      icon: <TableProperties className="h-12 w-12 text-blue-500" />
    },
    {
      title: "Sélectionnez vos adhérents",
      description: "Cochez les adhérents pour lesquels vous souhaitez générer des documents (appels de cotisation, factures, etc.).",
      icon: <Clipboard className="h-12 w-12 text-green-500" />
    },
    {
      title: "Choisissez votre modèle",
      description: "Sélectionnez le type de document à générer depuis la bibliothèque de modèles disponibles.",
      icon: <Filter className="h-12 w-12 text-purple-500" />
    },
    {
      title: "Générez les documents",
      description: "Un clic sur le bouton de génération crée automatiquement tous les PDF personnalisés pour les adhérents sélectionnés.",
      icon: <FileCheck className="h-12 w-12 text-green-500" />
    },
    {
      title: "Envoyez par email",
      description: "Envoyez directement les documents générés par email à vos adhérents en un seul clic ou téléchargez-les en lot.",
      icon: <Mail className="h-12 w-12 text-purple-500" />
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const completeTutorial = () => {
    // Marquer le tutoriel comme terminé
    localStorage.setItem('cpme-tutorial-completed', 'true');
    setShowTutorial(false);
    
    toast.success('Tutoriel terminé !', { 
      description: 'Vous pouvez le revoir à tout moment depuis les paramètres.' 
    });
  };
  
  const resetTutorial = () => {
    localStorage.removeItem('cpme-tutorial-completed');
  };

  return (
    <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            {steps[currentStep].icon}
          </div>
          <DialogTitle className="text-xl text-center mt-4">
            {steps[currentStep].title}
          </DialogTitle>
          <DialogDescription className="text-center">
            {steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center mt-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full mx-1 ${
                index === currentStep ? 'bg-primary' : 'bg-slate-200'
              }`}
            ></div>
          ))}
        </div>
        
        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={completeTutorial}
            className="mr-auto"
          >
            Ignorer
          </Button>
          <Button 
            type="button" 
            className="ml-auto"
            onClick={handleNext}
          >
            {currentStep < steps.length - 1 ? (
              <>
                Suivant <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              'Commencer'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
