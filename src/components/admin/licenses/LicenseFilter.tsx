
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Filter } from 'lucide-react';

export type FilterOptions = {
  status: string;
  search: string;
}

interface LicenseFilterProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const LicenseFilter: React.FC<LicenseFilterProps> = ({ 
  filters, 
  onFilterChange 
}) => {
  return (
    <div className="bg-slate-50 p-4 rounded-lg mb-6">
      <div className="flex items-center mb-4">
        <Filter className="h-4 w-4 mr-2 text-slate-500" />
        <h3 className="text-sm font-medium">Filtrer les licences</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-xs">Rechercher</Label>
          <Input
            id="search"
            placeholder="Rechercher par nom de CPME..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="h-9"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status" className="text-xs">Statut</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange({ ...filters, status: value })}
          >
            <SelectTrigger id="status" className="h-9">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actives</SelectItem>
              <SelectItem value="expired">Expirées</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default LicenseFilter;
