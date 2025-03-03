
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Building, 
  Calendar, 
  ShieldCheck, 
  Check, 
  X, 
  Plus, 
  MoreVertical,
  Clock,
  Ban
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type License = {
  id: string;
  cpme: string;
  plan: 'standard' | 'pro' | 'enterprise';
  status: 'active' | 'expired' | 'pending';
  users: number;
  maxUsers: number;
  startDate: string;
  endDate: string;
};

const LicenseManager: React.FC = () => {
  const [licenses, setLicenses] = useState<License[]>([
    {
      id: '1',
      cpme: 'CPME Seine-Saint-Denis (93)',
      plan: 'enterprise',
      status: 'active',
      users: 8,
      maxUsers: 25,
      startDate: '2023-01-15',
      endDate: '2024-01-15'
    },
    {
      id: '2',
      cpme: 'CPME Paris (75)',
      plan: 'pro',
      status: 'active',
      users: 5,
      maxUsers: 10,
      startDate: '2023-03-22',
      endDate: '2024-03-22'
    },
    {
      id: '3',
      cpme: 'CPME Val-de-Marne (94)',
      plan: 'standard',
      status: 'expired',
      users: 2,
      maxUsers: 3,
      startDate: '2023-02-10',
      endDate: '2023-12-10'
    },
    {
      id: '4',
      cpme: 'CPME Hauts-de-Seine (92)',
      plan: 'pro',
      status: 'pending',
      users: 0,
      maxUsers: 10,
      startDate: '2024-01-01',
      endDate: '2025-01-01'
    }
  ]);
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newLicense, setNewLicense] = useState<Partial<License>>({
    cpme: '',
    plan: 'standard',
    maxUsers: 3,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
  });
  
  const handleAddLicense = () => {
    const license: License = {
      id: Date.now().toString(),
      cpme: newLicense.cpme || '',
      plan: newLicense.plan as 'standard' | 'pro' | 'enterprise',
      status: 'active',
      users: 0,
      maxUsers: newLicense.maxUsers || 3,
      startDate: newLicense.startDate || new Date().toISOString().split('T')[0],
      endDate: newLicense.endDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    };
    
    setLicenses([...licenses, license]);
    setShowAddDialog(false);
    setNewLicense({
      cpme: '',
      plan: 'standard',
      maxUsers: 3,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    });
    
    toast.success('Licence ajoutée avec succès', {
      description: `La licence pour "${license.cpme}" a été créée.`
    });
  };
  
  const renewLicense = (licenseId: string) => {
    setLicenses(licenses.map(license => {
      if (license.id === licenseId) {
        const newEndDate = new Date(new Date(license.endDate).setFullYear(new Date(license.endDate).getFullYear() + 1)).toISOString().split('T')[0];
        return {
          ...license,
          status: 'active',
          endDate: newEndDate
        };
      }
      return license;
    }));
    
    toast.success('Licence renouvelée', {
      description: `La licence a été prolongée d'un an.`
    });
  };
  
  const suspendLicense = (licenseId: string) => {
    setLicenses(licenses.map(license => {
      if (license.id === licenseId) {
        return {
          ...license,
          status: 'expired'
        };
      }
      return license;
    }));
    
    toast.success('Licence suspendue', {
      description: `L'accès a été temporairement désactivé.`
    });
  };
  
  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'expired':
        return 'bg-red-500/10 text-red-600 border-red-200';
      case 'pending':
        return 'bg-orange-500/10 text-orange-600 border-orange-200';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Licences</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter une licence
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {licenses.map(license => (
          <Card key={license.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{license.cpme}</CardTitle>
                <Badge className={`${getBadgeColor(license.status)}`}>
                  {license.status === 'active' ? 'Active' : 
                   license.status === 'expired' ? 'Expirée' : 'En attente'}
                </Badge>
              </div>
              <CardDescription>
                Licence {license.plan === 'standard' ? 'Standard' : 
                        license.plan === 'pro' ? 'Pro' : 'Enterprise'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-slate-500" />
                  <span>
                    {license.users} / {license.maxUsers} utilisateurs
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                  <span>
                    Expire le {new Date(license.endDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      license.status === 'expired' 
                        ? 'bg-red-500' 
                        : 'bg-primary'
                    }`}
                    style={{ 
                      width: `${Math.min(100, (license.users / license.maxUsers) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-xs text-slate-500">
                ID: {license.id}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => renewLicense(license.id)}>
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Renouveler</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => suspendLicense(license.id)}>
                    <Ban className="h-4 w-4 mr-2" />
                    <span>Suspendre</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Add License Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
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
                onValueChange={(value: 'standard' | 'pro' | 'enterprise') => 
                  setNewLicense({
                    ...newLicense, 
                    plan: value,
                    maxUsers: value === 'standard' ? 3 : value === 'pro' ? 10 : 25
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (3 utilisateurs)</SelectItem>
                  <SelectItem value="pro">Pro (10 utilisateurs)</SelectItem>
                  <SelectItem value="enterprise">Enterprise (25 utilisateurs)</SelectItem>
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
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddLicense} disabled={!newLicense.cpme}>
              Créer la licence
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LicenseManager;
