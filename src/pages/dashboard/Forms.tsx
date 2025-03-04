
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Forms = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center">
          <FileText className="h-8 w-8 mr-3 text-primary" />
          Mes formulaires
        </h1>
        <Button className="flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Nouveau formulaire
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3).fill(null).map((_, index) => (
          <Card key={index} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between">
                <span>Formulaire {index + 1}</span>
              </CardTitle>
              <CardDescription>Créé le {new Date().toLocaleDateString('fr-FR')}</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm text-slate-600">
                {index === 0 ? "Informations client" : index === 1 ? "Formulaire d'inscription" : "Questionnaire satisfaction"}
              </p>
            </CardContent>
            <CardFooter className="pt-0 flex justify-end gap-2">
              <Button variant="outline" size="sm">
                Éditer
              </Button>
              <Button variant="default" size="sm">
                Voir
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default Forms;
