
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { License } from '@/services/firebase/firestore/types';

interface AddLicenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLicense: (license: Omit<License, 'id' | 'status' | 'users'>) => void;
}

const AddLicenseDialog: React.FC<AddLicenseDialogProps> = ({ 
  open, 
  onOpenChange, 
  onAddLicense 
}) => {
  const [newLicense, setNewLicense] = useState<Partial<License>>({
    cpme: '',
    plan: 'standard' as License['plan'],
    maxUsers: 1,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
  });

  const handleAddLicense = () => {
    onAddLicense({
      cpme: newLicense.cpme || '',
      plan: newLicense.plan as License['plan'],
      maxUsers: newLicense.maxUsers || 1,
      startDate: newLicense.startDate || new Date().toISOString().split('T')[0],
      endDate: newLicense.endDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    });
    
    // Reset form
    setNewLicense({
      cpme: '',
      plan: 'standard' as License['plan'],
      maxUsers: 1,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle licence</DialogTitle>
          <DialogDescription>
            Créez une licence pour donner accès à une CPME.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="cpme-name" className="text-sm font-medium">
              Nom de la CPME
            </label>
            <Input
              id="cpme-name"
              placeholder="Ex: CPME Île-de-France"
              value={newLicense.cpme}
              onChange={(e) => setNewLicense({...newLicense, cpme: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="plan-type" className="text-sm font-medium">
              Type de licence
            </label>
            <Select
              value={newLicense.plan}
              onValueChange={(value: License['plan']) => 
                setNewLicense({
                  ...newLicense, 
                  plan: value,
                  maxUsers: value === 'standard' ? 1 : value === 'pro' ? 1 : 3
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard (1 utilisateurs)</SelectItem>
                <SelectItem value="pro">Pro (1 utilisateurs)</SelectItem>
                <SelectItem value="enterprise">Enterprise (3 utilisateurs)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="start-date" className="text-sm font-medium">
                Date de début
              </label>
              <Input
                id="start-date"
                type="date"
                value={newLicense.startDate}
                onChange={(e) => setNewLicense({...newLicense, startDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="end-date" className="text-sm font-medium">
                Date d'expiration
              </label>
              <Input
                id="end-date"
                type="date"
                value={newLicense.endDate}
                onChange={(e) => setNewLicense({...newLicense, endDate: e.target.value})}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleAddLicense} disabled={!newLicense.cpme}>
            Créer la licence
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddLicenseDialog;
