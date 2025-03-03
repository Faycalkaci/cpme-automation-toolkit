
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DocumentSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DocumentSearch: React.FC<DocumentSearchProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
      <div className="relative w-full sm:w-auto sm:flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Rechercher un document..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue={activeTab} className="w-full sm:w-auto" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="appel">Appels</TabsTrigger>
          <TabsTrigger value="facture">Factures</TabsTrigger>
          <TabsTrigger value="rappel">Rappels</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default DocumentSearch;
