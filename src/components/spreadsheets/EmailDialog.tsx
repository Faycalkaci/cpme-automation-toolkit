
import React from 'react';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

interface Template {
  id: string;
  name: string;
  mappingFields?: string[];
}

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRows: any[];
  selectedTemplate: string;
  setSelectedTemplate: (value: string) => void;
  templates: Template[];
}

const EmailDialog: React.FC<EmailDialogProps> = ({
  open,
  onOpenChange,
  selectedRows,
  selectedTemplate,
  setSelectedTemplate,
  templates
}) => {
  const confirmSendEmail = () => {
    if (!selectedTemplate) {
      toast.error('Sélection requise', {
        description: 'Veuillez sélectionner un modèle de document à joindre.'
      });
      return;
    }
    
    const templateObj = templates.find(t => t.id === selectedTemplate);
    
    const emailAddresses: string[] = [];
    selectedRows.forEach(row => {
      if (row['E MAIL 1'] && row['E MAIL 1'].includes('@')) {
        emailAddresses.push(row['E MAIL 1']);
      }
      if (row['E Mail 2'] && row['E Mail 2'].includes('@')) {
        emailAddresses.push(row['E Mail 2']);
      }
    });
    
    toast.info('Adresses email destinataires', {
      description: emailAddresses.length > 3 
        ? `${emailAddresses.slice(0, 3).join(', ')} et ${emailAddresses.length - 3} autres adresses`
        : emailAddresses.join(', ')
    });
    
    toast.success('Envoi en cours', {
      description: `${emailAddresses.length} emails sont en cours d'envoi.`
    });
    
    setTimeout(() => {
      toast.success('Envoi terminé', {
        description: `${emailAddresses.length} emails ont été envoyés avec succès à ${selectedRows.length} adhérents.`
      });
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Envoyer par email</DialogTitle>
          <DialogDescription>
            Sélectionnez un modèle à joindre à vos emails.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="mb-4">
            Vous êtes sur le point d'envoyer des emails à {selectedRows.length} {selectedRows.length > 1 ? 'destinataires' : 'destinataire'}.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Modèle de document à joindre</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un modèle" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedTemplate === 'appel' && (
              <div className="mt-2">
                <p className="text-sm text-slate-600 mb-2">
                  Les emails seront envoyés en utilisant les champs suivants:
                </p>
                <div className="flex flex-wrap gap-1">
                  {templates.find(t => t.id === 'appel')?.mappingFields
                    ?.filter(field => field.toLowerCase().includes('mail'))
                    .map((field, index) => (
                      <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {field}
                      </span>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={confirmSendEmail} disabled={!selectedTemplate}>
            <Mail className="mr-2 h-4 w-4" />
            Envoyer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDialog;
