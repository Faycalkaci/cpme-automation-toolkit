
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, MoreVertical, Clock, Ban } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { License } from './types';
import { getBadgeColor } from './licenseUtils';

interface LicenseCardProps {
  license: License;
  onRenew: (id: string) => void;
  onSuspend: (id: string) => void;
}

const LicenseCard: React.FC<LicenseCardProps> = ({ license, onRenew, onSuspend }) => {
  return (
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
              Expire le {new Date(license.endDate || '').toLocaleDateString('fr-FR')}
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
                width: `${Math.min(100, ((license.users || 0) / (license.maxUsers || 1)) * 100)}%` 
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
            <DropdownMenuItem onClick={() => onRenew(license.id)}>
              <Clock className="h-4 w-4 mr-2" />
              <span>Renouveler</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSuspend(license.id)}>
              <Ban className="h-4 w-4 mr-2" />
              <span>Suspendre</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default LicenseCard;
