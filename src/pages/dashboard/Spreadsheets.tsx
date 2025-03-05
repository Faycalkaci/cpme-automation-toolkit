import React from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet } from 'lucide-react';
import { useLicenseGuard } from '@/services/guards/licenseGuard';
import { Spinner } from '@/components/ui/spinner';

const Spreadsheets = () => {
  const { isAuthorized, isLoading } = useLicenseGuard('spreadsheets');

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Component will redirect via the license guard
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center">
        <FileSpreadsheet className="h-8 w-8 mr-3 text-primary" />
        Classeurs
      </h1>
      <p className="text-slate-600 mb-6">
        Gérez vos données et générez des documents à partir de vos classeurs
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-lg mb-2">Importer des données</h3>
          <p className="text-slate-600 mb-4">Importez vos fichiers Excel ou CSV pour commencer</p>
          <button className="text-primary hover:underline">Commencer</button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-lg mb-2">Mes classeurs récents</h3>
          <p className="text-slate-600 mb-4">Accédez à vos classeurs récemment modifiés</p>
          <button className="text-primary hover:underline">Voir tous</button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-lg mb-2">Modèles de classeurs</h3>
          <p className="text-slate-600 mb-4">Utilisez nos modèles pour gagner du temps</p>
          <button className="text-primary hover:underline">Explorer</button>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Classeurs récents</h2>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 text-center text-slate-500">
            Aucun classeur récent. Commencez par importer des données.
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Spreadsheets;
