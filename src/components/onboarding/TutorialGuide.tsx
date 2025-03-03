
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, FileSpreadsheet, FileText, Mail } from 'lucide-react';

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
      description: "Commencez par importer votre fichier Excel ou CSV contenant les informations de vos adhérents.",
      icon: <FileSpreadsheet className="h-12 w-12 text-blue-500" />
    },
    {
      title: "Générez des documents",
      description: "Sélectionnez les adhérents et générez automatiquement les documents PDF comme les appels de cotisation.",
      icon: <FileText className="h-12 w-12 text-green-500" />
    },
    {
      title: "Envoyez par email",
      description: "Envoyez directement les documents générés par email à vos adhérents en un seul clic.",
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
